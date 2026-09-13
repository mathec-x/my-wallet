'use client';
import { useBalanceFactory } from '@/app/providers/balance/BalanceProvider';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


const FinancialMetricCard = ({ label, value, percentage, icon }: { label: string; value: string; percentage: string; icon?: React.ReactNode }) => (
  <Card sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
    <Avatar>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="body1">{label}</Typography>
      <Typography variant="body2" fontSize="20px">R$ {value}</Typography>
      <Typography variant="caption">{percentage}%</Typography>
    </Box>
  </Card>
);

const FinancialStatsCard = ({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) => (
  <Card sx={{ p: 2 }}>
    <Stack direction="row" justifyContent="space-between">
      <Typography>{label}</Typography>
      <Typography>{value}%</Typography>
    </Stack>
    <LinearProgress variant="determinate" value={Number(value)} />
    <Typography variant="caption">
      {children}
    </Typography>
  </Card>
);

const BalanceForm = () => {
  const balance = useBalanceFactory();

  const income = balance
    .incomes()
    .groupAndMean('amount', 'boardId');

  const expenses = balance
    .expenses()
    .categoryNotIn(['house'])
    .groupAndMean('amount', 'boardId');

  const house = balance
    .expenses()
    .categoryIn(['house'])
    .groupAndMean('amount', 'boardId');

  const carsAndTransport = balance
    .expenses()
    .categoryIn(['car', 'transport'])
    .groupAndMean('amount', 'boardId');

  const taxes = balance
    .expenses()
    .categoryIn(['tax'])
    .groupAndMean('amount', 'boardId');

  const healthAndFun = balance
    .expenses()
    .categoryIn(['health', 'fun'])
    .groupAndMean('amount', 'boardId');

  const savings = balance.savings().groupAndMean('amount', 'boardId');

  const incomeAmount = income.toInt();
  const expenseAmount = expenses.toInt();
  const savingAmount = savings.toInt();

  const availableRate = 1 - (expenseAmount / incomeAmount) - (savingAmount / incomeAmount);

  return (
    <Box p={2}>
      <Typography variant="h6">Resumo Financeiro</Typography>
      <Grid container spacing={2} my={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinancialMetricCard
            label="Entradas"
            value={income.toMoney()}
            percentage="100"
            icon={<TrendingUpIcon />} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinancialMetricCard
            label="Gastos"
            value={expenses.toMoney()}
            percentage={(expenses.percentage(incomeAmount, 1))}
            icon={<TrendingDownIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinancialMetricCard
            label="Poupança"
            value={savings.toMoney()}
            percentage={(savings.percentage(incomeAmount, 1))}
            icon={<SavingsIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinancialMetricCard
            label="Sobra"
            value={availableRate.toFixed(2)}
            percentage={(availableRate * 100).toFixed(1)}
            icon={<AccountBalanceWalletIcon />}
          />
        </Grid>
      </Grid>

      <Typography variant="h6">Saúde financeira</Typography>
      <Grid container spacing={2} my={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinancialStatsCard label='Moradia' value={house.percentage(incomeAmount)} >
            Referência: até 30%
          </FinancialStatsCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinancialStatsCard label='Saúde & Lazer' value={healthAndFun.percentage(incomeAmount)} >
            Referência: até 15%
          </FinancialStatsCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinancialStatsCard label='Transporte & Carro' value={carsAndTransport.percentage(incomeAmount)} >
            Referência: até 15%
          </FinancialStatsCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinancialStatsCard label='Impostos' value={taxes.percentage(incomeAmount)} >
            Referência: até 10%
          </FinancialStatsCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BalanceForm;
