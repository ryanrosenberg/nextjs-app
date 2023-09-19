import { Inter, Signika_Negative, Alegreya_Sans} from "next/font/google";
 
// define your variable fonts
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--table-header-font',
  });
const signika_neg = Signika_Negative({
    subsets: ['latin'],
    display: 'swap',
    variable: '--main-font',
  });
const alegreya_sans = Alegreya_Sans({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--header-font',
  });
 
export { inter, signika_neg, alegreya_sans };