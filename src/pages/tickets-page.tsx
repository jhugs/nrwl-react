import {
  TableHead,
  TableCell,
  Table,
  Paper,
  TableRow,
  TableBody,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGetBackendService from "../utils/use-backend-service";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

export interface TicketPageProps {}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const TicketPage: React.FC<TicketPageProps> = (props: TicketPageProps) => {
  const { tickets, error, loading } = useGetBackendService();
  const [filterByCompleted, setFilterByCompleted] = useState(false);

  return (
    <div>
      <h2>Tickets</h2>
      <div>
        <label htmlFor="des">Filter By Completed:</label>
        <input
          id="completed"
          type="checkbox"
          disabled={loading}
          checked={filterByCompleted}
          onChange={(e) => setFilterByCompleted(e.target.checked)}
        />
      </div>
      {tickets ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">AssgineeId</TableCell>
                <TableCell align="right">Completed</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets
                .filter((t) =>
                  filterByCompleted ? t.completed === filterByCompleted : true
                )
                .map((t) => (
                  <TableRow key={t.id}>
                    <TableCell component="th" scope="row">
                      {t.id}
                    </TableCell>
                    <TableCell align="right">{t.description}</TableCell>
                    <TableCell align="right">{t.assigneeId}</TableCell>
                    <TableCell align="right">
                      {t.completed?.toString()}
                    </TableCell>
                    <TableCell align="right">
                      <Link to={`/tickets/${t.id}`}>View</Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <span>{loading ? "..." : "Tickets unavailable"}</span>
      )}
      <div>{error !== null && error}</div>
    </div>
  );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default TicketPage;

// #endregion Exports;
