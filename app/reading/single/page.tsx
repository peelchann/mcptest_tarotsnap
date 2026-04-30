import SingleCardReadingClient from './SingleCardReadingClient';

export const metadata = {
  title: 'Single Card Reading',
  description:
    'Pull a single tarot card and receive a Coven Luxe reading from the Oracle.',
};

export default function SingleCardReadingPage() {
  return <SingleCardReadingClient />;
}
