import { Inter, Signika, Signika_Negative, Alegreya_Sans, Source_Sans_3} from "next/font/google";
 
// define your variable fonts
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--table-header-font',
  });
const signika = Signika({
      subsets: ['latin'],
      display: 'swap',
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

// define 2 weights of a non-variable font
const sourceCodePro400 = Source_Sans_3({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
  });
const sourceCodePro700 = Source_Sans_3({
    weight: '700',
    subsets: ['latin'],
    display: 'swap',
  });
 
export { inter, signika, signika_neg, alegreya_sans, sourceCodePro400, sourceCodePro700 };