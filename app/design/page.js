import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/design/index.html');
}
