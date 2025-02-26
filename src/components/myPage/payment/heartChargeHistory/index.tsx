import { useState } from 'react';

import usePaymentQueries from '@/hooks/usePaymentQueries';
import useScreenWidth from '@/hooks/useScreenWidth';

import Button from '@common/button';
import { layerCard } from '@common/layerCard';
import { layerPopup } from '@common/layerPopup';
import LoadingSpinner from '@common/loadingSpinner';
import Pagination from '@common/pagination';

import AccountNumber from '../accountNumber';

import { PaymentDetailsType } from '../types';
import { PAYMENT_METHOD, PAYMENT_STATUS, PER_PAGE } from '../constants';

const HeartChargeHistory = () => {
  const [page, setPage] = useState(1);

  const { isInit, isCustomWidth } = useScreenWidth(640);
  const { paymentHistory, isPaymentHistoryLoading, isPaymentHistoryError } = usePaymentQueries({
    page,
  });

  if (isPaymentHistoryError) {
    layerPopup({
      type: 'alert',
      content: '결제내역을 불러오는 데 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
    });
    return;
  }

  const handleStatusClick = (paymentId: number) => {
    layerCard({
      content: <AccountNumber paymentId={paymentId} />,
      size: 'max-w-xl h-[448px]',
    });
  };

  if (!isInit) return null;

  if (isPaymentHistoryLoading) return <LoadingSpinner />;

  if (!paymentHistory || paymentHistory.payment_details.length === 0)
    return (
      <p className="w-full h-full font-gMedium text-center content-center">결제 내역이 없습니다.</p>
    );

  const { payment_details: paymentDetails, total_count: totalResults } = paymentHistory;

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <table className="w-full">
        <thead>
          <tr className="h-10 border-b-2 border-purple tracking-tighter">
            <td>
              <strong>구매일자</strong>
            </td>
            <td>
              <strong>구매개수</strong>
            </td>
            <td>
              <strong>결제금액</strong>
            </td>
            {!isCustomWidth && (
              <td>
                <strong>결제수단</strong>
              </td>
            )}
            <td>
              <strong>결제상태</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {paymentDetails.map(
            ({
              payment_id: paymentId,
              purchase_date: date,
              payment_amount: price,
              payment_method: method,
              payment_status: status,
              quantity,
            }: PaymentDetailsType) => (
              <tr
                key={date}
                className="h-10 sm:h-12 lg:h-14 border-b border-purple tracking-tight text-xs sm:text-sm"
              >
                <td>{date.split('T')[0].replaceAll('-', '.')}</td>
                <td>{quantity}개</td>
                <td>{new Intl.NumberFormat('en-US').format(price)}원</td>
                {!isCustomWidth && <td>{PAYMENT_METHOD[method]}</td>}
                <td>
                  <Button
                    onClick={() => handleStatusClick(paymentId)}
                    variant="simple"
                    className="h-7 md:h-8 px-2 bg-cream font-gMedium text-sm text-purple md:text-purple hover:text-purple stroke-none"
                  >
                    {PAYMENT_STATUS[status]}
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <Pagination
        totalResults={totalResults}
        currentPage={page}
        setPage={setPage}
        perPage={PER_PAGE}
      />
    </div>
  );
};

export default HeartChargeHistory;
