import { useState } from 'react';

import usePaymentApi from '@/hooks/usePaymentApi';
import useScreenWidth from '@/hooks/useScreenWidth';

import { layerPopup } from '@common/layerPopup';
import Pagination from '@common/pagination';

import { TransformedProductDetailsType } from '../types';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../constants';

const HeartChargeHistory = () => {
  const [page, setPage] = useState(1);
  const { isInit, isCustomWidth } = useScreenWidth(640);
  const {
    getPaymentHistory: { data = { totalResult: 0, paymentDetails: [] }, isLoading, isError },
  } = usePaymentApi(page);

  const { totalResult, paymentDetails } = data;

  if (!isInit) return null;

  if (isError)
    layerPopup({
      type: 'alert',
      content: '결제내역을 불러오는 데 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
    });

  if (isLoading) return null;

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
          {paymentDetails &&
            paymentDetails.map(
              ({ date, price, quantity, method, status }: TransformedProductDetailsType) => (
                <tr
                  key={date}
                  className="h-10 sm:h-12 lg:h-14 border-b border-purple tracking-tight text-xs sm:text-sm"
                >
                  <td>{date.split('T')[0].replaceAll('-', '.')}</td>
                  <td>{quantity}개</td>
                  <td>{new Intl.NumberFormat('en-US').format(price)}원</td>
                  {!isCustomWidth && <td>{PAYMENT_METHOD[method]}</td>}
                  <td>
                    <button>{PAYMENT_STATUS[status]}</button>
                  </td>
                </tr>
              ),
            )}
        </tbody>
      </table>
      <Pagination totalResults={totalResult} currentPage={page} setPage={setPage} perPage={5} />
    </div>
  );
};

export default HeartChargeHistory;
