import { createSelector } from "reselect";

const selectOverviewState = state => state.overview;

export const selectCollectedData = createSelector(
  [selectOverviewState],
  overview => overview.collectedData
);
