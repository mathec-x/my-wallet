import TaxIcon from '@mui/icons-material/AccountBalance';
import LoanIcon from '@mui/icons-material/AttachMoney';
import GiftIcon from '@mui/icons-material/CardGiftcard';
import FunIcon from '@mui/icons-material/Casino';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TransportIcon from '@mui/icons-material/DirectionsCar';
import FamilyIcon from '@mui/icons-material/FamilyRestroom';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import HealthIcon from '@mui/icons-material/HealthAndSafety';
import HouseIcon from '@mui/icons-material/House';
import PetsIcon from '@mui/icons-material/Pets';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EducationIcon from '@mui/icons-material/School';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MarketIcon from '@mui/icons-material/Storefront';
import InvestmentIcon from '@mui/icons-material/TrendingUp';
import DonationIcon from '@mui/icons-material/VolunteerActivism';
import WorkIcon from '@mui/icons-material/Work';

export const categoriesList = {
  'food': { label: 'Alimentação', value: 'food', icon: <FoodBankIcon /> },
  'pets': { label: 'Animais', value: 'pets', icon: <PetsIcon /> },
  'credit_card': { label: 'Cartão de Crédito', value: 'credit_card', icon: <CreditCardIcon /> },
  'house': { label: 'Casa', value: 'house', icon: <HouseIcon /> },
  'shopping': { label: 'Compras', value: 'shopping', icon: <ShoppingCartIcon /> },
  'bill': { label: 'Conta', value: 'bill', icon: <ReceiptIcon /> },
  'donation': { label: 'Doação', value: 'donation', icon: <DonationIcon /> },
  'education': { label: 'Educação', value: 'education', icon: <EducationIcon /> },
  'loan': { label: 'Empréstimo', value: 'loan', icon: <LoanIcon /> },
  'family': { label: 'Família', value: 'family', icon: <FamilyIcon /> },
  'tax': { label: 'Imposto', value: 'tax', icon: <TaxIcon /> },
  'investment': { label: 'Investimento', value: 'investment', icon: <InvestmentIcon /> },
  'fun': { label: 'Lazer', value: 'fun', icon: <FunIcon /> },
  'market': { label: 'Mercado', value: 'market', icon: <MarketIcon /> },
  'gift': { label: 'Presente', value: 'gift', icon: <GiftIcon /> },
  'health': { label: 'Saúde', value: 'health', icon: <HealthIcon /> },
  'work': { label: 'Trabalho', value: 'work', icon: <WorkIcon /> },
  'transport': { label: 'Transporte', value: 'transport', icon: <TransportIcon /> },
  'default': { label: 'Sem categoria', value: '', icon: <ReceiptIcon /> },
};

export const categoriesOptions = Object
  .values(categoriesList)
  .map(category => ({
    label: category.label,
    value: category.value,
  }));