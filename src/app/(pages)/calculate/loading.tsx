import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Skeleton } from '@mui/material';

export default async function CalculateLoading() {
  return (
    <Paper sx={{ p: 2 }}>
      <Box p={2}>
        <Skeleton />
      </Box>
      <TableContainer sx={{ p: 2 }}>
        <Table>
          <caption>
            <Skeleton />
          </caption>
          <TableHead>
            <TableRow>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
              <TableCell><Skeleton /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[0, 1, 2, 4, 5, 6].map(e => (
              <TableRow key={'skeleton-table-' + e}>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
