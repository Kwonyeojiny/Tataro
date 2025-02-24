import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { FocusTrap } from 'focus-trap-react';
import { Heart, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import usePaymentQueries from '@/hooks/usePaymentQueries';
import useLayerCardStore from '@/stores/layerCardStore';
import usePaymentStore from '@/stores/paymentStore';

import Button from '@common/button';
import { layerCard } from '@common/layerCard';
import { layerPopup } from '@common/layerPopup';

import AccountNumber from '../accountNumber';
import { depositorSchema } from '../schema';

import { DepositorType } from '../types';

const EnterPayerNamePopup = () => {
  const queryClient = useQueryClient();
  const { sendPaymentRequest } = usePaymentQueries();
  const { selectedProduct, setDepositorName, setAccountInfo } = usePaymentStore(
    useShallow(state => ({
      selectedProduct: state.selectedProduct,
      setDepositorName: state.setDepositorName,
      setAccountInfo: state.setAccountInfo,
    })),
  );
  const { isVisible, hideLayerCard } = useLayerCardStore();

  const { productId, heart } = selectedProduct || { productId: 0, heart: 0 };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DepositorType>({
    resolver: zodResolver(depositorSchema),
    defaultValues: { depositorName: '' },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<DepositorType> = data => {
    const name = data.depositorName;
    if (!name || !productId) return;

    setDepositorName(name);
    sendPaymentRequest(
      { product_id: productId, name },
      {
        onSuccess: accountInfo => {
          queryClient.invalidateQueries({ queryKey: ['payment'] });
          setAccountInfo(accountInfo);

          layerCard({
            content: <AccountNumber />,
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
      },
    );
  };

  if (!productId) return null;

  return (
    <FocusTrap active={isVisible} focusTrapOptions={{ initialFocus: false }}>
      <div className="flex flex-col justify-between items-center gap-6 relative w-full h-full p-4 font-gMedium text-purple">
        <button onClick={hideLayerCard} className="absolute top-1 right-1">
          <X strokeWidth={1.5} className="text-purple" />
        </button>
        <p className="flex items-center gap-2 text-xl">
          <Heart strokeWidth={1} size={28} className="shrink-0 fill-deepPink text-purple" />
          하트
          <span className="font-gBold text-deepPink stroke"> {heart}</span>개
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between items-center grow w-full"
        >
          <div className="flex flex-col gap-4">
            <p>입금자명을 정확하게 입력해 주세요.</p>
            <div>
              <input
                {...register('depositorName')}
                type="text"
                className="w-60 border-b border-purple bg-transparent outline-none"
                autoComplete="off"
              />
              {errors.depositorName && (
                <p className="pt-1 text-red-600 text-sm">{errors.depositorName.message}</p>
              )}
            </div>
          </div>
          <Button type="submit" variant="simple" className="text-base">
            입력
          </Button>
        </form>
      </div>
    </FocusTrap>
  );
};

export default EnterPayerNamePopup;
