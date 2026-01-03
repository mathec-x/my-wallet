'use client';

import LoginForm from '@/app/components/composites/LoginForm/LoginForm';
import { FlexBox } from '@/app/components/elements';

export default function LoginDrawer() {
  // const [open, setOpen] = useState(false);

  // useLayoutEffect(() => {
  //   setOpen(true);
  //   return () => setOpen(false);
  // }, []);

  return (
    // <Drawer
    //   anchor="left"
    //   open={open}
    //   onClose={() => { }}
    //   slotProps={{
    //     paper: {
    //       sx: {
    //         height: '100vh',
    //         width: {
    //           md: '450px',
    //           lg: '550px',
    //           xs: '100%'
    //         }
    //       }
    //     }
    //   }}
    // >
    <FlexBox col p={{ md: 4, xs: 2 }} overflow='hidden'>
      <LoginForm />
    </FlexBox>
    // </Drawer >
  );
}
