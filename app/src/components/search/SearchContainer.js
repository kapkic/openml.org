import React, { memo } from "react";
import {
  Grid,
  Pagination,
  Box,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  NativeSelect,
  FormControl,
  InputLabel,
  Tab,
  Chip,
  Tabs,
} from "@mui/material";

import { TabContext, TabPanel } from "@mui/lab";

import ResultCard from "./ResultCard";
import styled from "@emotion/styled";

import {
  Facet,
  SearchProvider,
  Results,
  ResultsPerPage,
  Paging,
  PagingInfo,
  Sorting,
} from "@elastic/react-search-ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faList,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import Wrapper from "../Wrapper";

const SearchResults = styled(Results)`
  margin: 0px;
  padding: 0px;
`;

const FilterTabs = styled(Tabs)`
  min-height: 0px;
`;
const FilterTabPanel = styled(TabPanel)`
  min-height: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
`;

const FilterTab = styled(Tab)`
  min-height: 0px;
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  margin-right: 15px;
  border-radius: 50px;
  color: ${(props) => props.theme.palette.primary.main};
  background-color: ${(props) => props.theme.palette.background.default};

  &.Mui-selected {
    background-color: ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.palette.primary.contrastText};
  }
`;

let alignment = "left";
const handleAlignment = (event, newAlignment) => {
  alignment = newAlignment;
};

const SortView = ({ label, options, value, onChange }) => {
  if (value === "|||") {
    value = "[]";
  }
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Sort by
        </InputLabel>
        <NativeSelect
          value={value}
          onChange={(o) => onChange(o.nativeEvent.target.value)}
          inputProps={{
            name: "sort",
            id: "uncontrolled-native",
          }}
        >
          {options.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </Box>
  );
};

const ResultsPerPageView = ({ options, value, onChange }) => (
  <Box minWidth={80}>
    <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        Results per page
      </InputLabel>
      <NativeSelect
        value={value}
        onChange={(o) => onChange(o.nativeEvent.target.value)}
        inputProps={{
          name: "sort",
          id: "uncontrolled-native",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  </Box>
);

const ViewToggle = () => (
  <ToggleButtonGroup
    value={alignment}
    exclusive
    onChange={handleAlignment}
    sx={{
      ml: 2,
    }}
  >
    <ToggleButton value="left">
      <FontAwesomeIcon icon={faList} />
    </ToggleButton>
    <ToggleButton value="right">
      <FontAwesomeIcon icon={faTable} />
    </ToggleButton>
  </ToggleButtonGroup>
);

const PagingInfoView = ({ start, end, totalResults }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "end",
    }}
  >
    <Typography justifyContent="center" display="inline-block">
      Showing <b>{start}</b> - <b>{end}</b> out of <b>{totalResults}</b> results
    </Typography>
  </Box>
);

const PagingView = ({ current, resultsPerPage, totalPages, onChange }) => (
  <Pagination
    count={totalPages}
    color="primary"
    page={current}
    onChange={(event, value) => onChange(value)}
  />
);

const FilterChip = styled(Chip)`
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 50px;
`;

const FilterPanel = styled.div``;

const Filter = ({ label, options, values, onRemove, onSelect }) => {
  return (
    <FilterPanel>
      {options.map((option) => (
        <FilterChip
          label={option.value + "  (" + option.count + ")"}
          key={option.value}
          clickable
          onClick={() =>
            option.selected ? onRemove(option.value) : onSelect(option.value)
          }
          color={option.selected ? "primary" : "default"}
          variant={option.selected ? "default" : "outlined"}
        />
      ))}
    </FilterPanel>
  );
};

// This is the Search UI component. The config contains the search state and actions.
const SearchContainer = memo(
  ({ config, sort_options, search_facets, title, type }) => {
    const [filter, setFilter] = React.useState("None");
    const handleFilterChange = (event, newFilter) => {
      setFilter(newFilter + "");
    };
    return (
      <Wrapper fullWidth>
        <SearchProvider config={config}>
          <Grid container spacing={3}>
            <Grid item xs={12} m={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h3">{title}</Typography>
                <Button variant="contained" color="primary">
                  New {type}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} m={2}>
              <TabContext value={filter}>
                <Box>
                  <FilterTabs
                    value={filter}
                    onChange={handleFilterChange}
                    indicatorColor="none"
                  >
                    {search_facets.map((facet, index) => (
                      <FilterTab
                        value={facet.label}
                        label={facet.label}
                        key={facet.label}
                        iconPosition="start"
                        icon={<FontAwesomeIcon icon={faChevronDown} />}
                      />
                    ))}
                  </FilterTabs>
                </Box>
                {search_facets.map((facet, index) => (
                  <FilterTabPanel value={facet.label} key={index}>
                    <Facet
                      key={index}
                      field={facet.field}
                      label={facet.label}
                      filterType="any"
                      view={Filter}
                      value={filter}
                      index={index}
                    />
                  </FilterTabPanel>
                ))}
              </TabContext>
            </Grid>
            <Grid item xs={12} m={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <PagingInfo view={PagingInfoView} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Sorting
                    label="Sort by"
                    sortOptions={sort_options}
                    view={SortView}
                  />
                  <ViewToggle />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <SearchResults
                resultView={ResultCard}
                titleField="name"
                urlField="data_id"
                shouldTrackClickThrough
              />{" "}
            </Grid>
            <Grid item xs={12} m={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <ResultsPerPage
                  view={ResultsPerPageView}
                  options={[10, 20, 50, 100]}
                />
                <Paging view={PagingView} />
              </Box>
            </Grid>
          </Grid>
        </SearchProvider>
      </Wrapper>
    );
  }
);

SearchContainer.displayName = "SearchContainer";

export default SearchContainer;
