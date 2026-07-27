import { createApp } from 'vue';
import {
  BookOpen,
  CalendarDays,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Home,
  Mail,
  Plus,
  Search,
  Settings,
  Users,
  WalletCards,
} from '@lucide/vue';
import App from './App.vue';
import './styles.css';

const app = createApp(App);

Object.entries({
  BookOpen,
  CalendarDays,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Home,
  Mail,
  Plus,
  Search,
  Settings,
  Users,
  WalletCards,
}).forEach(([name, component]) => app.component(name, component));

app.mount('#app');
