'use client';
import { useBalanceFactory } from '@/app/providers/balance/BalanceProvider';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { NumberFormat } from '@/shared/utils/money-format';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const BalanceForm = () => {
  // const [value, setValue] = useState(1);
  const balance = useBalanceFactory();

  const incomes = balance.search(e => e.type === 'INCOME');
  return (
    <Box>
      <Toolbar>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="subtitle1"
          color='textDisabled'
        >
          Entradas: {incomes.size()}
        </Typography>
        {/* <Box p={2}>
        <Input
          fullWidth
          label="Quantidade de boards"
          type='number'
          inputMode='numeric'
          onFocus={e => e.target.select()}
          slotProps={{
            htmlInput: {
              min: 1,
              max: 24
            }
          }}
          value={value}
          onChange={({ target }) => setValue(Number(target.value))}
        />
      </Box> */}
      </Toolbar>
      <TableContainer>
        <Table size='small' sx={{ '& td': { fontSize: '0.8rem' } }}>
          <caption>
            <Typography sx={{ float: 'right' }}>
              {/* total de entradas em {value} boards: {incomes.multiply(e => e.expected || e.amount, value).toMoney()} */}
              total: {incomes.multiply(e => e.expected || e.amount, 1).toMoney()}
            </Typography>
          </caption>
          <TableHead>
            <TableRow>
              <TableCell>Quadro</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>R$</TableCell>
              <TableCell>Fixo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes.sort('boardId').map(e => (
              <TableRow key={'table-' + e.uuid}>
                <TableCell>{e.board?.name}</TableCell>
                <TableCell>
                  <Typography variant='caption' color='textDisabled' fontSize={9}>{e.description}</Typography>
                  <Typography variant='body2'>{e.title}</Typography>
                </TableCell>
                <TableCell>{NumberFormat.money(e.amount)}</TableCell>
                <TableCell>{e.expected === 0 ? <CloseIcon fontSize="small" /> : <DoneIcon fontSize="small" />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BalanceForm;
