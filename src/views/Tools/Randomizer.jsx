import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Card,
	Collapse,
	Typography,
	Box,
	Button,
	Fab,
	Dialog,
	DialogTitle,
	DialogActions,
	TextField,
	Divider,
	Tabs,
	Tab,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useStore } from "../../store";
import { useEffect, useState } from "preact/hooks";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { deep_clone, log_event } from "../../functions/utilities";
import { useAutoFocus, useModalHash } from "../../functions/customHooks";
import SwipeableViews from "react-swipeable-views";

function getResultHeight(length, selectedTab) {
	let height = selectedTab === 0 ? length * 20 : (length + 1) * 19.2;
	return height > 272 ? "272px" : `${height}px`;
}

export default function Randomizer() {
	const [store, updateStore] = useStore();
	const [expanded, setExpanded] = useState();
	const [newListLabel, setNewListLabel] = useState("");
	const [newListItems, setNewListItems] = useState("");
	const [selectedTab, setSelectedTab] = useState(0);
	const [randomizedList, setRandomizedList] = useState([]);
	const [resultBoxStyle, setResultBoxStyle] = useState({});
	const lists = store.lists;
	const history = store.history;

	// Modals
	const [newListDialog, setNewListDialog] = useState(false);
	const [resultsIsOpen, setResultsIsOpen] = useState(false);

	// Modal Hash Helpers
	useModalHash("new_list", newListDialog, closeNewListDialog);
	useModalHash("random_result", resultsIsOpen, closeResults);

	// Autoresize result dialog box according to selected tab
	useEffect(() => {
		const length = selectedTab === 0 ? randomizedList.length : history.length;
		setResultBoxStyle({
			overflowY: "auto",
			height: getResultHeight(length, selectedTab),
			transition: "height 0.25s ease-out",
		});
	}, [randomizedList, selectedTab, history]);

	// Autofocus chrome fix
	useAutoFocus(newListDialog, "new-list-label-field");

	function closeNewListDialog() {
		setNewListDialog(false);
		setNewListLabel("");
		setNewListItems("");
	}

	function createNewList() {
		const tempList = deep_clone(lists);
		tempList.push({
			label: newListLabel,
			// Separate items by line breaks and filter out blanks
			items: newListItems.split(/\r?\n/).filter(item => item !== ""),
		});
		updateStore("lists", tempList);
		setExpanded(tempList.length - 1);
		closeNewListDialog();

		// Log
		log_event("randomizer", "randomizer_create_new_list");
	}

	function deleteList(listIndex) {
		const tempList = deep_clone(lists);
		tempList.splice(listIndex, 1);
		updateStore("lists", tempList);
		setExpanded();

		// Log
		log_event("randomizer", "randomizer_delete_list");
	}

	function randomize(listIndex) {
		// Randomize list
		const itemList = deep_clone(lists[listIndex].items);
		for (let i = itemList.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[itemList[i], itemList[j]] = [itemList[j], itemList[i]];
		}
		setRandomizedList(itemList);

		// Update history log
		const tempHistory = deep_clone(history);
		tempHistory.unshift({
			label: lists[listIndex].label,
			time: new Date().toString().substring(4, 24),
		});

		// Only keep the most recent 10 logs
		while (tempHistory.length > 10) {
			tempHistory.pop();
		}
		updateStore("history", tempHistory);

		// Open results
		setResultsIsOpen(true);

		// Log
		log_event("randomizer", "randomizer_randomize");
	}

	function closeResults() {
		setResultsIsOpen(false);
		setSelectedTab(0);
	}

	return (
		<Box sx={styles.mainContainer}>
			<Card variant="outlined">
				<TransitionGroup>
					{lists?.map((list, listIndex) => (
						<Collapse in={true} key={listIndex}>
							<Accordion
								disableGutters
								elevation={0}
								expanded={expanded === listIndex}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreRoundedIcon />}
									onClick={() =>
										expanded !== listIndex
											? setExpanded(listIndex)
											: setExpanded("")
									}
								>
									<Typography variant="body1" sx={styles.label}>
										{list.label}
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Card variant="outlined" sx={styles.itemListContainer}>
										<Box sx={styles.itemListSubContainer}>
											{list.items.map((item, itemIndex) => (
												<Typography variant="body2" key={itemIndex}>
													{`${itemIndex + 1}. `}
													{item}
												</Typography>
											))}
										</Box>
										<Divider />
										<Box sx={styles.actionsContainer}>
											<Button fullWidth onClick={() => deleteList(listIndex)}>
												Delete
											</Button>
											<Button fullWidth onClick={() => randomize(listIndex)}>
												Randomize
											</Button>
										</Box>
									</Card>
								</AccordionDetails>
							</Accordion>
						</Collapse>
					))}
				</TransitionGroup>
			</Card>
			{/* Add Hint */}
			<Box sx={styles.addHintContainer}>
				<Typography variant="caption">
					<i>Tap the + icon to add a new entry</i>
				</Typography>
			</Box>
			{/* Fab */}
			<Fab
				color="primary"
				sx={styles.fab}
				onClick={() => setNewListDialog(true)}
			>
				<AddRoundedIcon />
			</Fab>

			{/* New List Dialog */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={newListDialog}
				PaperProps={{ elevation: 1 }}
			>
				<DialogTitle>New List</DialogTitle>
				<Box sx={styles.newListFormContainer}>
					<TextField
						id="new-list-label-field"
						fullWidth
						autoFocus
						autoComplete="off"
						size="small"
						label="Label"
						value={newListLabel}
						onChange={e => setNewListLabel(e.target.value)}
					/>
					<TextField
						fullWidth
						multiline
						rows={5}
						autoComplete="off"
						size="small"
						label="Items"
						value={newListItems}
						onChange={e => setNewListItems(e.target.value)}
						sx={styles.listBox}
					/>
					<Typography variant="subtitle2" sx={styles.newListHint}>
						<i>Separate the items with line breaks or "enter".</i>
					</Typography>
				</Box>
				<DialogActions>
					<Button onClick={closeNewListDialog}>Cancel</Button>
					<Button onClick={createNewList}>Add</Button>
				</DialogActions>
			</Dialog>

			{/* Results Dialog */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={resultsIsOpen}
				PaperProps={{ elevation: 1 }}
			>
				<Tabs
					variant="fullWidth"
					value={selectedTab}
					onChange={(_, newValue) => setSelectedTab(newValue)}
				>
					<Tab label="Results" value={0} />
					<Tab label="History" value={1} />
				</Tabs>
				<Box sx={styles.resultTabContainer}>
					<Typography variant="body2">List: {history[0].label}</Typography>
					<Typography variant="body2">Timestamp: {history[0].time}</Typography>
					<Divider sx={styles.divider} />
					<SwipeableViews
						index={selectedTab}
						onChangeIndex={newIndex => setSelectedTab(newIndex)}
					>
						<>
							<Box sx={resultBoxStyle}>
								{randomizedList.map((item, itemIndex) => (
									<Typography variant="body2" key={itemIndex}>
										{`${itemIndex + 1}. ${item}`}
									</Typography>
								))}
							</Box>
							<Divider sx={styles.divider} />
							<Typography variant="subtitle2">
								<i>Randomized with https://chocobun.web.app/</i>
							</Typography>
						</>
						<>
							<Box sx={resultBoxStyle}>
								<Typography sx={{ fontSize: "0.8rem" }}>
									Recent Randomizations:
								</Typography>
								{history.map((item, itemIndex) => (
									<Typography sx={{ fontSize: "0.8rem" }} key={itemIndex}>
										{`[${item.time}]: ${item.label}`}
									</Typography>
								))}
							</Box>
							<Divider sx={styles.divider} />
							<Typography variant="body2">
								<i>Tip: Use this tab to prove authenticity of randomization.</i>
							</Typography>
						</>
					</SwipeableViews>
				</Box>
				<DialogActions>
					<Button onClick={closeResults}>Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

const styles = {
	mainContainer: {
		overflow: "auto",
	},
	label: {
		paddingX: "8px",
	},
	itemListContainer: {
		padding: "16px 20px 0px",
	},
	itemListSubContainer: {
		maxHeight: "112px",
		overflowY: "auto",
		marginBottom: "16px",
	},
	actionsContainer: {
		display: "flex",
		justifyContent: "space-between",
		paddingY: "4px",
	},
	addHintContainer: {
		padding: "4px 16px",
	},
	fab: {
		position: "fixed",
		bottom: "16px",
		right: "16px",
	},
	newListFormContainer: {
		margin: "8px 20px",
	},
	listBox: {
		marginTop: "16px",
	},
	newListHint: {
		margin: "8px 0 0 8px",
	},
	resultTabContainer: {
		padding: "8px 12px 0px",
	},
	divider: {
		marginY: "4px",
	},
};
