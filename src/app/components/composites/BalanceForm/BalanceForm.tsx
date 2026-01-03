'use client';

import FullScreenModal from '@/app/components/elements/Modal';
import useModalHandler, { MODALS } from '@/app/hooks/useModalHandler';

const BalanceForm = () => {
  const modal = useModalHandler(MODALS.BALANCE_MODAL);

  return (
    <FullScreenModal
      name={modal.name}
      title={<>Editar</>}
      description={''}>
      modal
    </FullScreenModal >
  );
};


export default BalanceForm;