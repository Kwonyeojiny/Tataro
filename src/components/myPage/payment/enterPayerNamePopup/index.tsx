import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FocusTrap } from 'focus-trap-react';
import { Heart, X } from 'lucide-react';

import usePaymentQueries from '@/hooks/usePaymentQueries';
import useLayerCardStore from '@/stores/layerCardStore';

import Button from '@common/button';

import { depositorSchema } from '../schema';

import { DepositorType, EnterPayerNamePopupProps } from '../types';

const EnterPayerNamePopup = ({ productId, heart }: EnterPayerNamePopupProps) => {
  const { sendPaymentRequest } = usePaymentQueries({});
  const { isVisible, hideLayerCard } = useLayerCardStore();

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

    sendPaymentRequest({ product_id: productId, name });
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
          id="depositor-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center grow w-full"
        >
          <div className="flex flex-col gap-2">
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
        </form>
        <Button
          form="depositor-form"
          type="submit"
          variant="simple"
          className="text-base content-end"
        >
          입력
        </Button>
      </div>
    </FocusTrap>
  );
};

export default EnterPayerNamePopup;
