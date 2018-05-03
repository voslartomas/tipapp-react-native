import { TabNavigator, TabBarBottom } from 'react-navigation';
import MainComponent from './components/main.component';
import LeaderboardComponent from './components/leaderboard.component';

export default TabNavigator(
  {
    Dashboard: {
      screen: MainComponent,
    },
    Leaderboard: {
      screen: LeaderboardComponent,
    }
  },
  {
    
  }
);