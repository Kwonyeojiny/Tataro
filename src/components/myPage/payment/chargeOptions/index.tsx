import { useEffect } from 'react';
import { FocusTrap } from 'focus-trap-react';
import { X } from 'lucide-react';

import usePaymentQueries from '@/hooks/usePaymentQueries';
import useScreenWidth from '@/hooks/useScreenWidth';
import useLayerCardStore from '@/stores/layerCardStore';

import { layerPopup } from '@common/layerPopup';
import LoadingSpinner from '@common/loadingSpinner';

import HeartPriceTag from './HeartPriceTag';

const ChargeOptions = () => {
  const { isInit, isCustomWidth } = useScreenWidth(640);
  const { isVisible, hideLayerCard } = useLayerCardStore();
  const {
    getProductList: { data: productList, isLoading, isError },
  } = usePaymentQueries();

  useEffect(() => {
    const handleClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideLayerCard();
      }
    };

    document.addEventListener('keydown', handleClose);

    return () => document.removeEventListener('keydown', handleClose);
  }, [hideLayerCard]);

  if (isError) {
    layerPopup({
      type: 'alert',
      content: '상품 정보를 불러오는 데 오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.',
      onConfirmClick: hideLayerCard,
    });
  }

  if (isLoading) return <LoadingSpinner />;

  if (!isInit) return null;

  return (
    <FocusTrap active={isVisible} focusTrapOptions={{ initialFocus: false }}>
      <div className="flex flex-col justify-between items-center gap-6 relative w-full h-full p-6">
        <h3 className="font-lilita text-4xl text-purple">Heart Packages</h3>
        <X
          strokeWidth={1.5}
          size={28}
          className="absolute top-2 right-2 text-purple cursor-pointer"
          onClick={() => hideLayerCard()}
          tabIndex={0}
        />
        {!isCustomWidth && (
          <div className="flex justify-evenly w-full bg-purple">
            <div>
              {productList &&
                productList
                  .slice(0, 5)
                  .map(({ productId, heart, price }) => (
                    <HeartPriceTag
                      key={`${heart}개 ${price}원`}
                      productId={productId}
                      heart={heart}
                      price={price}
                    />
                  ))}
            </div>
            <div>
              {productList &&
                productList
                  .slice(5)
                  .map(({ productId, heart, price }) => (
                    <HeartPriceTag
                      key={`${heart}개 ${price}원`}
                      productId={productId}
                      heart={heart}
                      price={price}
                    />
                  ))}
            </div>
          </div>
        )}

        {isCustomWidth && (
          <div className="flex flex-col items-center w-full bg-purple overflow-y-scroll scrollbar-hide">
            {productList &&
              productList.map(({ productId, heart, price }) => (
                <HeartPriceTag
                  key={`${heart}개 ${price}원`}
                  productId={productId}
                  heart={heart}
                  price={price}
                />
              ))}
          </div>
        )}
      </div>
    </FocusTrap>
  );
};

export default ChargeOptions;
