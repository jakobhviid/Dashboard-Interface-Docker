import { createSelector } from "reselect";

const selectRessourceUsageState = state => state.ressourceUsage;

export const selectCollectedData = createSelector(
  [selectRessourceUsageState],
  ressourceUsage => ressourceUsage.collectedData
);
