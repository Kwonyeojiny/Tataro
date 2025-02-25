import { FocusTrap } from 'focus-trap-react';
import { Heart, X } from 'lucide-react';

import usePaymentQueries from '@/hooks/usePaymentQueries';
import useLayerCardStore from '@/stores/layerCardStore';
import formatDateAndTime from '@/utils/formatDateAndTime';

import { layerPopup } from '@common/layerPopup';
import LoadingSpinner from '@common/loadingSpinner';

import { AccountNumberProps } from '../types';

const AccountNumber = ({ paymentId }: AccountNumberProps) => {
  const { isVisible, hideLayerCard } = useLayerCardStore();

  const {
    paymentDetails,
    isPaymentDetailsLoading,
    isPaymentDetailsError,
    isRequestPaymentPending,
  } = usePaymentQueries({ paymentId });

  if (isRequestPaymentPending || isPaymentDetailsLoading) return <LoadingSpinner />;

  if (isPaymentDetailsError) {
    layerPopup({
      type: 'alert',
      content: '결제 정보를 가져오는 데 실패하였습니다.\n잠시 후에 다시 시도해 주세요.',
    });
    return;
  }

  return (
    <FocusTrap active={isVisible} focusTrapOptions={{ initialFocus: false }}>
      <div className="w-full h-full">
        {isRequestPaymentPending && <LoadingSpinner />}
        {!isRequestPaymentPending && (
          <div className="flex flex-col justify-between items-center gap-6 relative w-full h-full py-4 font-gMedium text-purple">
            <button onClick={hideLayerCard} className="absolute top-1 right-1">
              <X strokeWidth={1.5} className="text-purple" />
            </button>
            <p className="flex items-center gap-2 text-xl">
              <Heart strokeWidth={1} size={28} className="shrink-0 fill-deepPink text-purple" />
              하트
              <span className="font-gBold text-deepPink stroke">
                {' '}
                {paymentDetails?.heart_count}
              </span>
              개
            </p>

            <div className="flex flex-col items-center text-lg">
              <p>
                입금금액:{' '}
                <strong>
                  {new Intl.NumberFormat('en-US').format(paymentDetails?.deposit_amount || 0)}원
                </strong>
              </p>
              <p>
                입금자명: <strong>{paymentDetails?.depositor_name}</strong>
              </p>
            </div>
            <div className="flex flex-col justify-center items-center grow text-lg sm:text-xl">
              <p className="flex flex-col items-center">무통장 입금 계좌 안내</p>
              <div className="p-2 border border-purple bg-white">
                <p>은행명: {paymentDetails?.admin_bank}</p>
                <p>예금주: {paymentDetails?.admin_name}</p>
                <p className="flex flex-col sm:flex-row gap-1">
                  계좌번호:<span className="font-gBold">{paymentDetails?.admin_account}</span>
                </p>
              </div>
            </div>
            <p>입금기한: {formatDateAndTime(paymentDetails?.deadline ?? '')}</p>
            <div className="text-sm tracking-tight">
              <p>입금 시, 금액과 입금자명을 정확히 입력해 주세요.</p>
              <p>위의 정보와 다를 경우 입금 확인이 지연될 수 있습니다.</p>
            </div>
          </div>
        )}
      </div>
    </FocusTrap>
  );
};

export default AccountNumber;
