import { redirect } from 'next/navigation';

export default function PublicPage() {
  return redirect('/menu');
}
