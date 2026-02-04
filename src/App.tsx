import { useUserStore } from "./domain/auth/userStore";
import { useUiStore } from "./shared/store/uiStore";
import { useDeliveryStore } from "./domain/deliveries/deliveryStore";
import { Toaster } from "./components/ui/sonner";
import { LoginScreen } from "./components/LoginScreen";
import { Dashboard } from "./components/Dashboard";
import {
  CheckInScreen,
} from "./components/CheckInScreen";
import { CustomerRegistration } from "./components/CustomerRegistration";
import { CustomerList } from "./components/CustomerList";
import { CustomerHistory } from "./components/CustomerHistory";
import { PendingContracts } from "./components/PendingContracts";
import { PDVStandalone } from "./components/PDVStandalone";
import { RoutesScreen } from "./components/RoutesScreen";
import { RouteDetails } from "./components/RouteDetails";
import { DeliveriesOverview } from "./components/DeliveriesOverview";
import { BottomNavigation } from "./components/BottomNavigation";



export default function App() {
  const { isLoggedIn, login } = useUserStore();
  const { currentScreen, setCurrentScreen, setSelectedCustomer, selectedCustomer } = useUiStore();
  const {
    selectedDelivery,
    selectedRoute,
    deliveryStatuses,
    setSelectedDelivery,
    setSelectedRoute,
    updateDeliveryStatus
  } = useDeliveryStore();

  if (!isLoggedIn) {
    return <LoginScreen onLogin={login} />;
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "deliveries":
        return (
          <DeliveriesOverview
            deliveryStatuses={deliveryStatuses}
            onSelectDelivery={(delivery) => {
              setSelectedDelivery(delivery);
              // Create a route object from the delivery information
              setSelectedRoute({
                id: `route-${delivery.id}`,
                name: delivery.routeName || "Rota Individual",
                zone:
                  delivery.address.split(" - ")[1] ||
                  "Zona não especificada",
                deliveries: [delivery], // Single delivery route
              });
              setCurrentScreen("route-details");
            }}
          />
        );

      case "routes":
        return (
          <RoutesScreen
            onSelectRoute={(route) => {
              setSelectedRoute(route);
              setCurrentScreen("route-details");
            }}
          />
        );

      case "route-details":
        return (
          <RouteDetails
            route={selectedRoute}
            deliveryStatuses={deliveryStatuses}
            onBack={() => {
              // Return to the appropriate previous screen
              if (
                selectedDelivery &&
                selectedRoute?.deliveries?.length === 1
              ) {
                // If it's a single delivery route, go back to deliveries
                setCurrentScreen("deliveries");
              } else {
                // Otherwise go back to routes
                setCurrentScreen("routes");
              }
            }}
            onCheckIn={(delivery) => {
              setSelectedDelivery(delivery);
              setCurrentScreen("checkin");
            }}
            onOpenPDV={(delivery) => {
              setSelectedDelivery(delivery);
              setCurrentScreen("pdv-delivery");
            }}
          />
        );

      case "checkin":
        return (
          <CheckInScreen
            delivery={selectedDelivery}
            onBack={() => setCurrentScreen("route-details")}
            onCheckInComplete={(delivery, status, hadSale) => {
              // Update delivery status
              updateDeliveryStatus(delivery.id, {
                checkInStatus: status,
                hadSale: hadSale,
                timestamp: new Date().toISOString(),
              });

              if (hadSale) {
                // Go to PDV if there was a sale
                setCurrentScreen("pdv-delivery");
              } else {
                // Return to route details otherwise
                setCurrentScreen("route-details");
              }
            }}
          />
        );

      case "customers":
        return (
          <CustomerList
            onAddCustomer={() =>
              setCurrentScreen("customer-registration")
            }
            onViewContracts={() =>
              setCurrentScreen("contracts")
            }
            onViewHistory={(customer) => {
              setSelectedCustomer(customer);
              setCurrentScreen("customer-history");
            }}
          />
        );

      case "customer-history":
        return (
          <CustomerHistory
            customer={selectedCustomer}
            onBack={() => setCurrentScreen("customers")}
          />
        );

      case "customer-registration":
        return (
          <CustomerRegistration
            onBack={() => setCurrentScreen("customers")}
            onSuccess={() => setCurrentScreen("contracts")}
          />
        );

      case "contracts":
        return (
          <PendingContracts
            onBack={() => setCurrentScreen("customers")}
          />
        );

      case "pdv":
        return <PDVStandalone />;

      case "pdv-delivery":
        return (
          <PDVStandalone
            delivery={selectedDelivery}
            onBack={() => setCurrentScreen("route-details")}
          />
        );

      // Legacy dashboard para compatibilidade
      case "dashboard":
        return (
          <Dashboard
            onSelectDelivery={(delivery) => {
              setSelectedDelivery(delivery);
              setCurrentScreen("checkin");
            }}
            onAddCustomer={() =>
              setCurrentScreen("customer-registration")
            }
          />
        );

      default:
        return (
          <DeliveriesOverview
            deliveryStatuses={deliveryStatuses}
            onSelectDelivery={(delivery) => {
              setSelectedDelivery(delivery);
              // Create a route object from the delivery information
              setSelectedRoute({
                id: `route-${delivery.id}`,
                name: delivery.routeName || "Rota Individual",
                zone:
                  delivery.address.split(" - ")[1] ||
                  "Zona não especificada",
                deliveries: [delivery], // Single delivery route
              });
              setCurrentScreen("route-details");
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-hidden">
        {renderCurrentScreen()}
      </div>
      <BottomNavigation
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
      <Toaster />
    </div>
  );
}