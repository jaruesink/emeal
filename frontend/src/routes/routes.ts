import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { PublicLayout } from '../layout/PublicLayout';
import { PrivateLayout } from '../layout/PrivateLayout';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { DesignPage } from '../pages/DesignPage';
import { ComponentType } from 'react';
import { EmbedPage } from '../pages/EmbedPage';
import { PaymentPage } from '../pages/Payment/PaymentPage';
import { PrivateLayoutSimple } from '../layout/PrivateLayoutSimple';
import { SelectPlan } from '../pages/Payment/SelectPlan';
import { RedeemPage } from '../pages/RedeemPage';
import { SubscriptionsPage } from '../pages/SubscriptionsPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';

interface RouteConfig {
  path?: string;
  component: ComponentType;
  exact?: boolean;
  layout?: ComponentType;
}

interface EmealRoutes {
  public: RouteConfig[];
  private: RouteConfig[];
}

export const emealLayouts = {
  public: PublicLayout,
  private: PrivateLayout,
};

export const routes: EmealRoutes = {
  public: [
    {
      path: '/login',
      component: LoginPage,
      exact: true,
    },
    {
      path: '/signup',
      component: SignupPage,
      exact: true,
    },
    {
      path: '/reset-password',
      component: ForgotPasswordPage,
      exact: true,
    },
    {
      path: '/change-password/:token',
      component: ChangePasswordPage,
      exact: true,
    },
    {
      path: '/redeem/:couponToken',
      component: RedeemPage,
      exact: true,
    },
  ],
  private: [
    {
      path: '/select-plan',
      component: SelectPlan,
      exact: true,
      layout: PrivateLayoutSimple,
    },
    {
      path: '/payment',
      component: PaymentPage,
      exact: true,
      layout: PrivateLayoutSimple,
    },
    {
      path: '/project/:projectId',
      component: DashboardPage,
      exact: true,
    },
    {
      path: '/profile',
      component: ProfilePage,
    },
    {
      path: '/subscriptions',
      component: SubscriptionsPage,
      exact: true,
    },
    {
      path: '/project/:projectId/design',
      component: DesignPage,
      exact: true,
    },
    {
      path: '/project/:projectId/embed',
      component: EmbedPage,
      exact: true,
    },
    {
      // No Match
      component: DashboardPage,
    },
  ],
};
