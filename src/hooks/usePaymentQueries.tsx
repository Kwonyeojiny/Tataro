import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getPaymentDetails,
  getPaymentHistory,
  getProductList,
  postPaymentRequest,
} from '@/api/paymentApi';

import { layerCard } from '@common/layerCard';
import { layerPopup } from '@common/layerPopup';

import AccountNumber from '../components/myPage/payment/accountNumber/index';

import {
  BankTransferRequestType,
  DepositInfoResponseType,
  PaymentHistoryResponseType,
  TransformedProductListType,
} from '@/components/myPage/payment/types';

const usePaymentQueries = ({ page, paymentId }: { page?: number; paymentId?: number }) => {
  const queryClient = useQueryClient();

  const {
    data: paymentHistory,
    isLoading: isPaymentHistoryLoading,
    isError: isPaymentHistoryError,
  } = useQuery<PaymentHistoryResponseType>({
    queryKey: ['payment', page],
    queryFn: async () => {
      if (!page) throw new Error('Page parameter required');

      const paymentHistory = await getPaymentHistory(page);
      return paymentHistory;
    },
    refetchOnWindowFocus: false,
    enabled: !!page,
  });

  const { mutate: sendPaymentRequest, isPending: isRequestPaymentPending } = useMutation<
    DepositInfoResponseType,
    Error,
    BankTransferRequestType
  >({
    mutationKey: ['payment'],
    mutationFn: async (paymentRequest: BankTransferRequestType) => {
      const paymentInfo = await postPaymentRequest(paymentRequest);
      return paymentInfo;
    },
    onSuccess: paymentInfo => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });

      layerCard({
        content: <AccountNumber paymentId={paymentInfo.payment_id} />,
        size: 'max-w-xl h-[448px]',
        isOutsideClickActive: false,
      });
    },
    onError: error => {
      if (error instanceof Error) console.error(error);

      layerPopup({
        type: 'alert',
        content: '계좌번호를 받아오는 데 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
      });
    },
  });

  const {
    data: productList,
    isLoading: isProductListLoading,
    isError: isProductListError,
  } = useQuery<TransformedProductListType>({
    queryKey: ['product'],
    queryFn: async () => await getProductList(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: paymentDetails,
    isLoading: isPaymentDetailsLoading,
    isError: isPaymentDetailsError,
  } = useQuery<DepositInfoResponseType>({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      if (!paymentId) throw new Error('PaymentId parameter required');

      const paymentDetails = await getPaymentDetails(paymentId);
      return paymentDetails;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    enabled: !!paymentId,
  });

  return {
    paymentHistory,
    isPaymentHistoryLoading,
    isPaymentHistoryError,
    sendPaymentRequest,
    isRequestPaymentPending,
    productList,
    isProductListLoading,
    isProductListError,
    paymentDetails,
    isPaymentDetailsLoading,
    isPaymentDetailsError,
  };
};

export default usePaymentQueries;
