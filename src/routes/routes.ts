 import ScreenNameEnum from "./screenName.enum";
import NotificationsScreen from "../screen/Notification/Notification";
import Sinup from "../screen/auth/sinup/Sinup";
 import HelpScreen from "../screen/Profile/Help/Helps";
import Splash from "../screen/auth/Splash/Splash";
import PhoneLogin from "../screen/auth/PhoneLogin/PhoneLogin";
 import LegalPoliciesScreen from "../screen/Profile/LegalPoliciesScreen";
import PrivacyPolicy from "../screen/Profile/PrivacyPolicy";
import EditProfile from "../screen/Profile/EditProfile/EditProfile";

 import UserRoleSetting from "../screen/UserRole/UserRoleSetting/UserRoleSetting";
import ChoosePlan from "../screen/auth/ChoosePlan/ChoosePlan";
import YourGoalScreen from "../screen/YourGoalScreen/YourGoal";
import ContributionInputScreen from "../screen/InvestmentPlanScreen/ContributionInputScreen";
import PreferencesScreen from "../screen/PreferencesScreen/PreferencesScreen";
import RecommendedAllocation from "../screen/RecommendedAllocation/RecommendedAllocation";
import SavedPlansScreen from "../screen/SavedPlansScreen/SavedPlansScreen";
import FinancialCalculatorScreen from "../screen/FinancialCalculator/FinancialCalculatorScreen";
import InvestmentScenarioScreen from "../screen/InvestmentScenarioScreen/InvestmentScenarioScreen";
import ProfileQuizScreen from "../screen/InvestmentPlanScreen/ProfileQuizScreen";
import FinanShare from "../screen/FinanShare/FinanShare";
  const _routes: any = {
    REGISTRATION_ROUTE: [
      {
        name: ScreenNameEnum.SPLASH_SCREEN,
        Component: Splash,
      },
      {
        name: ScreenNameEnum.ProfileQuizScreen,
        Component: ProfileQuizScreen,
      },
    {
      name: ScreenNameEnum.Sinup,
      Component: Sinup,
    },
    {
      name: ScreenNameEnum.FinanShare,
      Component: FinanShare,
    },
    {
      name: ScreenNameEnum.YourGoalScreen,
      Component: YourGoalScreen,
    },
    {
      name: ScreenNameEnum.ChoosePlan,
      Component: ChoosePlan,
    },
    {
      name: ScreenNameEnum.SavedPlansScreen,
      Component: SavedPlansScreen,
    },
 
    {
      name: ScreenNameEnum.InvestmentScenarioScreen,
      Component: InvestmentScenarioScreen,
    },
 

 
 
    {
      name: ScreenNameEnum.RecommendedAllocation,
      Component: RecommendedAllocation,
    },
 
    {
      name: ScreenNameEnum.FinancialCalculatorScreen,
      Component: FinancialCalculatorScreen,
    },
    {
      name: ScreenNameEnum.PreferencesScreen,
      Component: PreferencesScreen,
    },
    {
      name: ScreenNameEnum.ContributionInputScreen,
      Component: ContributionInputScreen,
    },
   


  

    {
      name: ScreenNameEnum.EditProfile,
      Component: EditProfile,
    },
 


    {
      name: ScreenNameEnum.PhoneLogin,
      Component: PhoneLogin,
    },

    

 

    {
      name: ScreenNameEnum.Help,
      Component: HelpScreen,
    },
    //    {
    //   name: ScreenNameEnum.TabNavigator,
    //   Component: TabNavigator,
    // },

    {
      name: ScreenNameEnum.PrivacyPolicy,
      Component: PrivacyPolicy,
    },
   
  
    
    {
      name: ScreenNameEnum.ProfileScreen,
      Component: EditProfile,
    },
    
   
    {
      name: ScreenNameEnum.LegalPoliciesScreen,
      Component: LegalPoliciesScreen,
    },



    {
      name: ScreenNameEnum.NotificationsScreen,
      Component: NotificationsScreen,
    },
    {
      name: ScreenNameEnum.setting,
      Component: UserRoleSetting,
    },

    //    {
    //   name: ScreenNameEnum.DocumentShow,
    //   Component: DocumentShow,
    // },

  ],


};

export default _routes;
