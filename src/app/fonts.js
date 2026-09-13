import {
  Rubik,
  Jost,
  Dancing_Script,
} from "next/font/google";

// export const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
// })

// export const roboto_mono = Roboto_Mono({
//   subsets: ['latin'],
//   display: 'swap',
// })
export const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
});
export const jost = Jost({
  subsets: ["latin"],
  display: "swap",
});
export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-satisfy",
});
