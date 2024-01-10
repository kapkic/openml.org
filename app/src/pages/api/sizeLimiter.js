import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { Typography } from "@mui/material";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

export class CollapsibleDataTable extends React.Component {
  constructor() {
    super();
    this.state = { expanded: false };
  }

  render() {
    let title =
      this.props.title !== undefined ? (
        <Typography variant="h4" mb={6}>
          {this.props.title}
        </Typography>
      ) : (
        ""
      );
    let subtitle =
      this.props.subtitle !== undefined ? (
        <div className={"subtitle"}>{this.props.subtitle}</div>
      ) : (
        ""
      );

    let tableHead =
      this.props.columns !== undefined ? (
        <TableHead>
          <TableRow>
            {this.props.columns.map((m) => (
              <TableCell key={m}>{m}</TableCell>
            ))}
          </TableRow>
        </TableHead>
      ) : (
        ""
      );

    let tableBody = "";
    let collapsor = "";
    let maxlen;

    if (this.props.data !== undefined) {
      maxlen =
        this.props.maxLength !== undefined
          ? Math.min(this.props.data.length, this.props.maxLength)
          : this.props.data.length;
      tableBody = (
        <TableBody>
          {this.props.data
            .slice(0, this.state.expanded ? this.props.data.length : maxlen)
            .map(this.props.rowrenderer)}
        </TableBody>
      );

      if (this.props.maxLength < this.props.data.length) {
        if (this.state.expanded) {
          collapsor = (
            <div
              style={{ cursor: "pointer", float: "right" }}
              onClick={() => this.setState({ expanded: false })}
            >
              <FontAwesomeIcon icon={faCaretUp} /> Collapse
            </div>
          );
        } else {
          collapsor = (
            <div
              style={{ cursor: "pointer", float: "right" }}
              onClick={() => this.setState({ expanded: true })}
            >
              <FontAwesomeIcon icon={faCaretDown} /> Expand
            </div>
          );
        }
      }
    }

    return (
      <div>
        {collapsor}
        {title}
        {subtitle}
        <Table>
          {tableHead}
          {tableBody}
        </Table>
        {this.state.expanded ? collapsor : ""}
        <div style={{ clear: "right" }}></div>
      </div>
    );
  }
}

export class StringLimiter extends React.Component {
  render() {
    let string = this.props.value.substring(0, this.props.maxLength);
    return string + (string.length < this.props.value.length ? "..." : "");
  }
}
