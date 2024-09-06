export interface CheckoutScreenProps {
  onNext: () => void;
  isPageChanging: boolean;
  onOrderCreateSuccess?: (orderId: number) => void;
  onPrev: () => void;
  everyItemDigital?: boolean;
}
