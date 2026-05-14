export type TestCase = {
  label: string;
  latex: string;
  mathspeak: string;
  clearspeak: string;
};

const angCases: TestCase[] = [
  {
    label: 'ang-0',
    latex: String.raw`\ang{10}`,
    mathspeak: '10 degree',
    clearspeak: '10 degrees',
  },
  {
    label: 'ang-1',
    latex: String.raw`\ang{12.3}`,
    mathspeak: '12.3 degree',
    clearspeak: '12.3 degrees',
  },
  {
    label: 'ang-2',
    latex: String.raw`\ang{4,5}`,
    mathspeak: '4.5 degree',
    clearspeak: '4.5 degrees',
  },
  {
    label: 'ang-3',
    latex: String.raw`\ang{1;2;3}`,
    mathspeak: '1 degree 2 degree-minutes 3 degree-seconds',
    clearspeak: '1 degree 2 degree-minutes 3 degree-seconds',
  },
  {
    label: 'ang-4',
    latex: String.raw`\ang{;;1}`,
    mathspeak: '1 degree-second',
    clearspeak: '1 degree-second',
  },
  {
    label: 'ang-5',
    latex: String.raw`\ang{+10;;}`,
    mathspeak: '10 degree',
    clearspeak: '10 degrees',
  },
  {
    label: 'ang-6',
    latex: String.raw`\ang{-0;1;}`,
    mathspeak: '0 degree 1 degree-minute',
    clearspeak: '0 degrees 1 degree-minute',
  },
  {
    label: 'ang-7',
    latex: String.raw`\ang{2.67}`,
    mathspeak: '2.67 degree',
    clearspeak: '2.67 degrees',
  },
  {
    label: 'ang-8',
    latex: String.raw`\ang{2;3;4}`,
    mathspeak: '2 degree 3 degree-minutes 4 degree-seconds',
    clearspeak: '2 degrees 3 degree-minutes 4 degree-seconds',
  },
  {
    label: 'ang-9',
    latex: String.raw`\ang[angle-mode = arc]{2.67}`,
    mathspeak: '2.67 degree',
    clearspeak: '2.67 degrees',
  },
  {
    label: 'ang-10',
    latex: String.raw`\ang[angle-mode = arc]{2;3;4}`,
    mathspeak: '2 degree 3 degree-minutes 4 degree-seconds',
    clearspeak: '2 degrees 3 degree-minutes 4 degree-seconds',
  },
  {
    label: 'ang-11',
    latex: String.raw`\ang[angle-mode = decimal]{2.67}`,
    mathspeak: '2.67 degree',
    clearspeak: '2.67 degrees',
  },
  {
    label: 'ang-12',
    latex: String.raw`\ang[angle-mode = decimal]{2;3;4}`,
    mathspeak: '2.051 111 111 111 111 degree',
    clearspeak: '2.051 111 111 111 111 degrees',
  },
  {
    label: 'ang-13',
    latex: String.raw`\ang{2.67}`,
    mathspeak: '2.67 degree',
    clearspeak: '2.67 degrees',
  },
  {
    label: 'ang-14',
    latex: String.raw`\ang[number-angle-product = {\,}]{2.67}`,
    mathspeak: '2.67 degree',
    clearspeak: '2.67 degrees',
  },
  {
    label: 'ang-15',
    latex: String.raw`\ang{6;7;6.5}`,
    mathspeak: '6 degree 7 degree-minutes 6.5 degree-seconds',
    clearspeak: '6 degrees 7 degree-minutes 6.5 degree-seconds',
  },
  {
    label: 'ang-16',
    latex: String.raw`\ang[angle-separator = {\,}]{6;7;6.5}`,
    mathspeak: '6 degree 7 degree-minutes 6.5 degree-seconds',
    clearspeak: '6 degrees 7 degree-minutes 6.5 degree-seconds',
  },
  {
    label: 'ang-17',
    latex: String.raw`\ang[angle-separator = {\,}]{6;;}`,
    mathspeak: '6 degree',
    clearspeak: '6 degrees',
  },
  {
    label: 'ang-18',
    latex: String.raw`\ang[fill-angle-degrees]{;-2;}`,
    mathspeak: 'negative 0 degree 2 degree-minutes',
    clearspeak: 'negative 0 degrees 2 degree-minutes',
  },
  {
    label: 'ang-19',
    latex: String.raw`\sisetup{fill-angle-degrees}\ang{;-2;}`,
    mathspeak: 'negative 0 degree 2 degree-minutes',
    clearspeak: 'negative 0 degrees 2 degree-minutes',
  },
  {
    label: 'ang-20',
    latex: String.raw`\displaylines{
  \ang{-1;;} \\
  \ang{;-2;} \\
  \ang{;;-3} \\
}`,
    mathspeak:
      'StartLayout 1st Row  negative 1 degree 2nd Row  negative 0 degree 2 degree-minutes 3rd Row  negative 0 degree 3 degree-seconds EndLayout',
    clearspeak:
      '3 lines Line 1: negative 1 degrees Line 2: negative 0 degrees 2 degree-minutes Line 3: negative 0 degrees 3 degree-seconds',
  },
  {
    label: 'ang-21',
    latex: String.raw`\displaylines{
  \sisetup{fill-angle-degrees}
  \ang{-1;;} \\
  \ang{;-2;} \\
  \ang{;;-3} \\
  \sisetup{fill-angle-degrees = false}
}`,
    mathspeak:
      'StartLayout 1st Row  negative 1 degree 2nd Row  negative 0 degree 2 degree-minutes 3rd Row  negative 0 degree 3 degree-seconds EndLayout',
    clearspeak:
      '3 lines Line 1: negative 1 degrees Line 2: negative 0 degrees 2 degree-minutes Line 3: negative 0 degrees 3 degree-seconds',
  },
  {
    label: 'ang-22',
    latex: String.raw`\displaylines{
  \sisetup{fill-angle-minutes}
  \ang{-1;;} \\
  \ang{;-2;} \\
  \ang{;;-3} \\
  \sisetup{fill-angle-minutes = false}
}`,
    mathspeak:
      'StartLayout 1st Row  negative 1 degree 0 degree-minutes 2nd Row  negative 2 degree-minutes 3rd Row  negative 0 degree-minutes 3 degree-seconds EndLayout',
    clearspeak:
      '3 lines Line 1: negative 1 degrees 0 degree-minutes Line 2: negative 2 degree-minutes Line 3: negative 0 degree-minutes 3 degree-seconds',
  },
  {
    label: 'ang-23',
    latex: String.raw`\displaylines{
  \sisetup{fill-angle-seconds}
  \ang{-1;;} \\
  \ang{;-2;} \\
  \ang{;;-3} \\
  \sisetup{fill-angle-seconds = false}
}`,
    mathspeak:
      'StartLayout 1st Row  negative 1 degree 0 degree-seconds 2nd Row  negative 2 degree-minutes 0 degree-seconds 3rd Row  negative 3 degree-seconds EndLayout',
    clearspeak:
      '3 lines Line 1: negative 1 degrees 0 degree-seconds Line 2: negative 2 degree-minutes 0 degree-seconds Line 3: negative 3 degree-seconds',
  },
  {
    label: 'ang-24',
    latex: String.raw`\ang{6;7;6.5}`,
    mathspeak: '6 degree 7 degree-minutes 6.5 degree-seconds',
    clearspeak: '6 degrees 7 degree-minutes 6.5 degree-seconds',
  },
  {
    label: 'ang-25',
    latex: String.raw`\sisetup{
	angle-symbol-degree = d ,
	angle-symbol-minute = m ,
	angle-symbol-second = s
}
\ang{6;7;6.5}
\sisetup{
	angle-symbol-degree = \degree ,
	angle-symbol-minute = ' ,
	angle-symbol-second = ''
}`,
    mathspeak: '6 normal d Baseline 7 normal m Baseline 6.5 normal s',
    clearspeak: '6 normal d 7 meters 6.5 seconds',
  },
  {
    label: 'ang-26',
    latex: String.raw`\ang{45.697}`,
    mathspeak: '45.697 degree',
    clearspeak: '45.697 degrees',
  },
  {
    label: 'ang-27',
    latex: String.raw`\ang{6;7;6.5}`,
    mathspeak: '6 degree 7 degree-minutes 6.5 degree-seconds',
    clearspeak: '6 degrees 7 degree-minutes 6.5 degree-seconds',
  },
  {
    label: 'ang-28',
    latex: String.raw`\ang[angle-symbol-over-decimal]{45.697}`,
    mathspeak: '45 period degree 697',
    clearspeak: '45 period degrees 697',
  },
  {
    label: 'ang-29',
    latex: String.raw`\ang[angle-symbol-over-decimal]{6;7;6.5}`,
    mathspeak:
      '6 degree 7 degree-minutes 6 period Overscript degree-seconds Endscripts 5',
    clearspeak:
      '6 degrees 7 degree-minutes 6 period with degree-seconds above 5',
  },
];

const numCases: TestCase[] = [
  {
    label: 'num-0',
    latex: String.raw`\num{0}`,
    mathspeak: '0',
    clearspeak: '0',
  },
  {
    label: 'num-1',
    latex: String.raw`\num{1234}`,
    mathspeak: '1234',
    clearspeak: '1234',
  },
  {
    label: 'num-2',
    latex: String.raw`\num{1234p}`,
    mathspeak: '',
    clearspeak: '',
  },
  {
    label: 'num-3',
    latex: String.raw`\num{12345}`,
    mathspeak: '12 345',
    clearspeak: '12 345',
  },
  {
    label: 'num-4',
    latex: String.raw`\num{0.123}`,
    mathspeak: '0.123',
    clearspeak: '0.123',
  },
  {
    label: 'num-5',
    latex: String.raw`\num{0.10000}`,
    mathspeak: '0.100 00',
    clearspeak: '0.100 00',
  },
  {
    label: 'num-6',
    latex: String.raw`\num{.123}`,
    mathspeak: '0.123',
    clearspeak: '0.123',
  },
  {
    label: 'num-7',
    latex: String.raw`\num{0,1234}`,
    mathspeak: '0.1234',
    clearspeak: '0.1234',
  },
  {
    label: 'num-8',
    latex: String.raw`\num{.12345}`,
    mathspeak: '0.123 45',
    clearspeak: '0.123 45',
  },
  {
    label: 'num-9',
    latex: String.raw`\num{3.45d-4}`,
    mathspeak: '3.45 times 10 Superscript negative 4',
    clearspeak: '3.45 times 10 to the negative 4 power',
  },
  {
    label: 'num-10',
    latex: String.raw`\num{-e10}`,
    mathspeak: 'minus 0 10 Superscript 10',
    clearspeak: 'negative 0 10 to the tenth power',
  },
  {
    label: 'num-11',
    latex: String.raw`\num{< 10}`,
    mathspeak: 'less than 10',
    clearspeak: 'is less than 10',
  },
  {
    label: 'num-12',
    latex: String.raw`\num{>> 5}`,
    mathspeak: 'much greater than 5',
    clearspeak: 'is much greater than 5',
  },
  {
    label: 'num-13',
    latex: String.raw`\num{\le 0.12}`,
    mathspeak: 'less than or equals 0.12',
    clearspeak: 'is less than or equal to 0.12',
  },
  {
    label: 'num-14',
    latex: String.raw`\num{9.99(9)}`,
    mathspeak: '9.99 left parenthesis 9 right parenthesis',
    clearspeak: '9.99 times 9',
  },
  {
    label: 'num-15',
    latex: String.raw`\num{9.99 +- 0.09}`,
    mathspeak: '9.99 left parenthesis 9 right parenthesis',
    clearspeak: '9.99 times 9',
  },
  {
    label: 'num-16',
    latex: String.raw`\num{9.99 \pm 0.09}`,
    mathspeak: '9.99 left parenthesis 9 right parenthesis',
    clearspeak: '9.99 times 9',
  },
  {
    label: 'num-17',
    latex: String.raw`\num{123 +- 4.5}`,
    mathspeak: '123.0 left parenthesis 45 right parenthesis',
    clearspeak: '123.0 times 45',
  },
  {
    label: 'num-18',
    latex: String.raw`\num{12.3 +- 6}`,
    mathspeak: '12.3 left parenthesis 6 right parenthesis',
    clearspeak: '12.3 times 6',
  },
  {
    label: 'num-19',
    latex: String.raw`\num{123.4(12)}`,
    mathspeak: '123.4 left parenthesis 12 right parenthesis',
    clearspeak: '123.4 times 12',
  },
  {
    label: 'num-20',
    latex: String.raw`\num{123.4(1.2)}`,
    mathspeak: '123.4 left parenthesis 12 right parenthesis',
    clearspeak: '123.4 times 12',
  },
  {
    label: 'num-21',
    latex: String.raw`\num{123.4(12)(45)}`,
    mathspeak:
      '123.4 left parenthesis 12 right parenthesis left parenthesis 45 right parenthesis',
    clearspeak: '123.4 times 12 times 45',
  },
  {
    label: 'num-22',
    latex: String.raw`\num{123.4 \pm 1.2 \pm 4.5}`,
    mathspeak:
      '123.4 left parenthesis 12 right parenthesis left parenthesis 45 right parenthesis',
    clearspeak: '123.4 times 12 times 45',
  },
  {
    label: 'num-23',
    latex: String.raw`\num[uncertainty-mode=separate]{123.4(12)(45)}`,
    mathspeak: '123.4 plus or minus 1.2 plus or minus 4.5',
    clearspeak: '123.4 plus or minus 1.2 plus or minus 4.5',
  },
  {
    label: 'num-24',
    latex: String.raw`\num[uncertainty-mode=separate]{123.4 \pm 1.2 \pm 4.5}`,
    mathspeak: '123.4 plus or minus 1.2 plus or minus 4.5',
    clearspeak: '123.4 plus or minus 1.2 plus or minus 4.5',
  },
  {
    label: 'num-25',
    latex: String.raw`\num{\sqrt{2}}`,
    mathspeak: '',
    clearspeak: '',
  },
  {
    label: 'num-26',
    latex: String.raw`\num[parse-numbers = false]{\sqrt{2}}`,
    mathspeak: 'StartRoot 2 EndRoot',
    clearspeak: 'the square root of 2',
  },
  {
    label: 'num-27',
    latex: String.raw`\num[evaluate-expression]{2 + 4 * 3}`,
    mathspeak: '14',
    clearspeak: '14',
  },
  {
    label: 'num-28',
    latex: String.raw`\num[evaluate-expression, expression = 10 * (#1)]{2 + 4 * 3}`,
    mathspeak: '140',
    clearspeak: '140',
  },
  {
    label: 'num-29',
    latex: String.raw`\num{10.}`,
    mathspeak: '10',
    clearspeak: '10',
  },
  {
    label: 'num-30',
    latex: String.raw`\num[retain-explicit-decimal-marker]{10.}`,
    mathspeak: '10 period',
    clearspeak: '10 period',
  },
  {
    label: 'num-31',
    latex: String.raw`\num{+345}`,
    mathspeak: '345',
    clearspeak: '345',
  },
  {
    label: 'num-32',
    latex: String.raw`\num[retain-explicit-plus]{+345}`,
    mathspeak: 'plus 345',
    clearspeak: 'positive 345',
  },
  {
    label: 'num-33',
    latex: String.raw`\num{-345}`,
    mathspeak: 'negative 345',
    clearspeak: 'negative 345',
  },
  {
    label: 'num-34',
    latex: String.raw`\num{-0}`,
    mathspeak: '0',
    clearspeak: '0',
  },
  {
    label: 'num-35',
    latex: String.raw`\num[retain-negative-zero]{-0}`,
    mathspeak: 'negative 0',
    clearspeak: 'negative 0',
  },
  {
    label: 'num-36',
    latex: String.raw`\num{12.3(0)}`,
    mathspeak: '12.3',
    clearspeak: '12.3',
  },
  {
    label: 'num-37',
    latex: String.raw`\num[retain-zero-uncertainty]{12.3(0)}`,
    mathspeak: '12.3 left parenthesis 0 right parenthesis',
    clearspeak: '12.3 times 0',
  },
  {
    label: 'num-38',
    latex: String.raw`\num{0.001}`,
    mathspeak: '0.001',
    clearspeak: '0.001',
  },
  {
    label: 'num-39',
    latex: String.raw`\num{0.0100}`,
    mathspeak: '0.0100',
    clearspeak: '0.0100',
  },
  {
    label: 'num-40',
    latex: String.raw`\num{1200}`,
    mathspeak: '1200',
    clearspeak: '1200',
  },
  {
    label: 'num-41',
    latex: String.raw`\num[exponent-mode = scientific]{0.001}`,
    mathspeak: '1 times 10 Superscript negative 3',
    clearspeak: '1 times 10 to the negative 3 power',
  },
  {
    label: 'num-42',
    latex: String.raw`\num[exponent-mode = scientific]{0.0100}`,
    mathspeak: '1.00 times 10 Superscript negative 2',
    clearspeak: '1.00 times 10 to the negative 2 power',
  },
  {
    label: 'num-43',
    latex: String.raw`\num[exponent-mode = scientific]{1200}`,
    mathspeak: '1.200 times 10 cubed',
    clearspeak: '1.200 times 10 cubed',
  },
  {
    label: 'num-44',
    latex: String.raw`\num[exponent-mode = engineering]{0.001}`,
    mathspeak: '1 times 10 Superscript negative 3',
    clearspeak: '1 times 10 to the negative 3 power',
  },
  {
    label: 'num-45',
    latex: String.raw`\num[exponent-mode = engineering]{0.0100}`,
    mathspeak: '10.0 times 10 Superscript negative 3',
    clearspeak: '10.0 times 10 to the negative 3 power',
  },
  {
    label: 'num-46',
    latex: String.raw`\num[exponent-mode = engineering]{1200}`,
    mathspeak: '1.200 times 10 cubed',
    clearspeak: '1.200 times 10 cubed',
  },
  {
    label: 'num-47',
    latex: String.raw`\num[exponent-mode = fixed, fixed-exponent=2]{0.001}`,
    mathspeak: '0.000 01 times 10 squared',
    clearspeak: '0.000 01 times 10 squared',
  },
  {
    label: 'num-48',
    latex: String.raw`\num[exponent-mode = fixed, fixed-exponent=2]{0.0100}`,
    mathspeak: '0.000 100 times 10 squared',
    clearspeak: '0.000 100 times 10 squared',
  },
  {
    label: 'num-49',
    latex: String.raw`\num[exponent-mode = fixed, fixed-exponent=2]{1200}`,
    mathspeak: '12.00 times 10 squared',
    clearspeak: '12.00 times 10 squared',
  },
  {
    label: 'num-50',
    latex: String.raw`\num[exponent-mode = fixed, fixed-exponent=0]{0.0100}`,
    mathspeak: '0.0100',
    clearspeak: '0.0100',
  },
  {
    label: 'num-51',
    latex: String.raw`\num[exponent-mode = fixed, fixed-exponent=0]{1.00e-2}`,
    mathspeak: '0.0100',
    clearspeak: '0.0100',
  },
  {
    label: 'num-52',
    latex: String.raw`\num{1.23e4}`,
    mathspeak: '1.23 times 10 Superscript 4',
    clearspeak: '1.23 times 10 to the fourth power',
  },
  {
    label: 'num-53',
    latex: String.raw`\num[exponent-mode = fixed, fixed-exponent=0]{1.23e4}`,
    mathspeak: '12 300 period',
    clearspeak: '12 300 period',
  },
  {
    label: 'num-54',
    latex: String.raw`\displaylines{
  \sisetup{exponent-mode = threshold}
  \num{0.001} \\
  \num{0.012} \\
  \num{0.123} \\
  \num{1} \\
  \num{12} \\
  \num{123} \\
  \num{1234} \\
  \sisetup{exponent-mode = input}
}`,
    mathspeak:
      'StartLayout 1st Row  1 times 10 Superscript negative 3 2nd Row  0.012 3rd Row  0.123 4th Row  1 5th Row  12 6th Row  123 7th Row  1.234 times 10 cubed EndLayout',
    clearspeak:
      '7 lines Line 1: 1 times 10 to the negative 3 power Line 2: 0.012 Line 3: 0.123 Line 4: 1 Line 5: 12 Line 6: 123 Line 7: 1.234 times 10 cubed',
  },
  {
    label: 'num-55',
    latex: String.raw`\displaylines{
  \sisetup{exponent-mode = threshold, exponent-thresholds = -2:2 }
  \num{0.001} \\
  \num{0.012} \\
  \num{0.123} \\
  \num{1} \\
  \num{12} \\
  \num{123} \\
  \num{1234} \\
  \sisetup{exponent-mode = input}
}`,
    mathspeak:
      'StartLayout 1st Row  1 times 10 Superscript negative 3 2nd Row  1.2 times 10 Superscript negative 2 3rd Row  0.123 4th Row  1 5th Row  12 6th Row  1.23 times 10 squared 7th Row  1.234 times 10 cubed EndLayout',
    clearspeak:
      '7 lines Line 1: 1 times 10 to the negative 3 power Line 2: 1.2 times 10 to the negative 2 power Line 3: 0.123 Line 4: 1 Line 5: 12 Line 6: 1.23 times 10 squared Line 7: 1.234 times 10 cubed',
  },
  {
    label: 'num-56',
    latex: String.raw`\num{0.01(2)}`,
    mathspeak: '0.01 left parenthesis 2 right parenthesis',
    clearspeak: '0.01 times 2',
  },
  {
    label: 'num-57',
    latex: String.raw`\num[drop-uncertainty]{0.01(2)}`,
    mathspeak: '0.01',
    clearspeak: '0.01',
  },
  {
    label: 'num-58',
    latex: String.raw`\num{0.01e3}`,
    mathspeak: '0.01 times 10 cubed',
    clearspeak: '0.01 times 10 cubed',
  },
  {
    label: 'num-59',
    latex: String.raw`\num[drop-exponent]{0.01e3}`,
    mathspeak: '0.01',
    clearspeak: '0.01',
  },
  {
    label: 'num-60',
    latex: String.raw`\num{1.23456}`,
    mathspeak: '1.234 56',
    clearspeak: '1.234 56',
  },
  {
    label: 'num-61',
    latex: String.raw`\num{14.23}`,
    mathspeak: '14.23',
    clearspeak: '14.23',
  },
  {
    label: 'num-62',
    latex: String.raw`\num{0.12345(9)}`,
    mathspeak: '0.123 45 left parenthesis 9 right parenthesis',
    clearspeak: '0.123 45 times 9',
  },
  {
    label: 'num-63',
    latex: String.raw`\num[round-mode = places, round-precision = 3]{1.23456}`,
    mathspeak: '1.235',
    clearspeak: '1.235',
  },
  {
    label: 'num-64',
    latex: String.raw`\num[round-mode = places, round-precision = 3]{14.23}`,
    mathspeak: '14.230',
    clearspeak: '14.230',
  },
  {
    label: 'num-65',
    latex: String.raw`\num[round-mode = places, round-precision = 3]{0.12345(9)}`,
    mathspeak: '0.123 45 left parenthesis 9 right parenthesis',
    clearspeak: '0.123 45 times 9',
  },
  {
    label: 'num-66',
    latex: String.raw`\num[round-mode = figures, round-precision = 3]{1.23456}`,
    mathspeak: '1.23',
    clearspeak: '1.23',
  },
  {
    label: 'num-67',
    latex: String.raw`\num[round-mode = figures, round-precision = 3]{14.23}`,
    mathspeak: '14.2',
    clearspeak: '14.2',
  },
  {
    label: 'num-68',
    latex: String.raw`\num[round-mode = figures, round-precision = 3]{0.12345(9)}`,
    mathspeak: '0.123 45 left parenthesis 9 right parenthesis',
    clearspeak: '0.123 45 times 9',
  },
  {
    label: 'num-69',
    latex: String.raw`\num[round-mode = figures, round-precision = 3]{25555}`,
    mathspeak: '25 600',
    clearspeak: '25 600',
  },
  {
    label: 'num-70',
    latex: String.raw`\num[round-mode = uncertainty, round-precision = 1]{0.12345(9)}`,
    mathspeak: '0.123 45 left parenthesis 9 right parenthesis',
    clearspeak: '0.123 45 times 9',
  },
  {
    label: 'num-71',
    latex: String.raw`\num[round-mode = uncertainty, round-precision = 1]{0.12345(23)}`,
    mathspeak: '0.1235 left parenthesis 2 right parenthesis',
    clearspeak: '0.1235 times 2',
  },
  {
    label: 'num-72',
    latex: String.raw`\num[round-mode = uncertainty, round-precision = 1]{0.12345(234)}`,
    mathspeak: '0.123 left parenthesis 2 right parenthesis',
    clearspeak: '0.123 times 2',
  },
  {
    label: 'num-73',
    latex: String.raw`\num[round-mode = figures, round-precision = 4]{12.3}`,
    mathspeak: '12.30',
    clearspeak: '12.30',
  },
  {
    label: 'num-74',
    latex: String.raw`\num[round-mode = figures, round-precision = 4, round-pad = false]{12.3}`,
    mathspeak: '12.3',
    clearspeak: '12.3',
  },
  {
    label: 'num-75',
    latex: String.raw`\num[round-mode = figures, round-precision = 1, round-half = up]{0.055}`,
    mathspeak: '0.06',
    clearspeak: '0.06',
  },
  {
    label: 'num-76',
    latex: String.raw`\num[round-mode = figures, round-precision = 1, round-half = up]{0.045}`,
    mathspeak: '0.05',
    clearspeak: '0.05',
  },
  {
    label: 'num-77',
    latex: String.raw`\num[round-mode = figures, round-precision = 1, round-half = even]{0.055}`,
    mathspeak: '0.06',
    clearspeak: '0.06',
  },
  {
    label: 'num-78',
    latex: String.raw`\num[round-mode = figures, round-precision = 1, round-half = even]{0.045}`,
    mathspeak: '0.04',
    clearspeak: '0.04',
  },
  {
    label: 'num-79',
    latex: String.raw`\num[round-mode = places]{0.0055}`,
    mathspeak: '0.01',
    clearspeak: '0.01',
  },
  {
    label: 'num-80',
    latex: String.raw`\num[round-mode = places]{0.0045}`,
    mathspeak: '0.00',
    clearspeak: '0.00',
  },
  {
    label: 'num-81',
    latex: String.raw`\num[round-mode = places, round-minimum = 0.01]{0.0055}`,
    mathspeak: '0.01',
    clearspeak: '0.01',
  },
  {
    label: 'num-82',
    latex: String.raw`\num[round-mode = places, round-minimum = 0.01]{0.0045}`,
    mathspeak: 'less than 0.01',
    clearspeak: 'is less than 0.01',
  },
  {
    label: 'num-83',
    latex: String.raw`\num[round-mode = places]{-0.001}`,
    mathspeak: '0.00',
    clearspeak: '0.00',
  },
  {
    label: 'num-84',
    latex: String.raw`\num[round-mode = places, round-zero-positive = false]{-0.001}`,
    mathspeak: 'negative 0.00',
    clearspeak: 'negative 0.00',
  },
  {
    label: 'num-85',
    latex: String.raw`\num{2.0}`,
    mathspeak: '2.0',
    clearspeak: '2.0',
  },
  {
    label: 'num-86',
    latex: String.raw`\num{2.1}`,
    mathspeak: '2.1',
    clearspeak: '2.1',
  },
  {
    label: 'num-87',
    latex: String.raw`\num[drop-zero-decimal]{2.0}`,
    mathspeak: '2',
    clearspeak: '2',
  },
  {
    label: 'num-88',
    latex: String.raw`\num[drop-zero-decimal]{2.1}`,
    mathspeak: '2.1',
    clearspeak: '2.1',
  },
  {
    label: 'num-89',
    latex: String.raw`\num{123}`,
    mathspeak: '123',
    clearspeak: '123',
  },
  {
    label: 'num-90',
    latex: String.raw`\num[minimum-integer-digits = 2]{123}`,
    mathspeak: '123',
    clearspeak: '123',
  },
  {
    label: 'num-91',
    latex: String.raw`\num[minimum-integer-digits = 4]{123}`,
    mathspeak: '0123',
    clearspeak: '0123',
  },
  {
    label: 'num-92',
    latex: String.raw`\num{0.123}`,
    mathspeak: '0.123',
    clearspeak: '0.123',
  },
  {
    label: 'num-93',
    latex: String.raw`\num[minimum-decimal-digits = 2]{0.123}`,
    mathspeak: '0.123',
    clearspeak: '0.123',
  },
  {
    label: 'num-94',
    latex: String.raw`\num[minimum-decimal-digits = 4]{0.123}`,
    mathspeak: '0.1230',
    clearspeak: '0.1230',
  },
  {
    label: 'num-95',
    latex: String.raw`\num{12345.67890}`,
    mathspeak: '12 345.678 90',
    clearspeak: '12 345.678 90',
  },
  {
    label: 'num-96',
    latex: String.raw`\num[group-digits = none]{12345.67890}`,
    mathspeak: '12345.67890',
    clearspeak: '12345.67890',
  },
  {
    label: 'num-97',
    latex: String.raw`\num[group-digits = decimal]{12345.67890}`,
    mathspeak: '12345.678 90',
    clearspeak: '12345.678 90',
  },
  {
    label: 'num-98',
    latex: String.raw`\num[group-digits = integer]{12345.67890}`,
    mathspeak: '12 345.67890',
    clearspeak: '12 345.67890',
  },
  {
    label: 'num-99',
    latex: String.raw`\num{12345}`,
    mathspeak: '12 345',
    clearspeak: '12 345',
  },
  {
    label: 'num-100',
    latex: String.raw`\num[group-separator = {,}]{12345}`,
    mathspeak: '12,345',
    clearspeak: '12,345',
  },
  {
    label: 'num-101',
    latex: String.raw`\num[group-separator = \ ]{12345}`,
    mathspeak: '12 345',
    clearspeak: '12 345',
  },
  {
    label: 'num-102',
    latex: String.raw`\num{1234}`,
    mathspeak: '1234',
    clearspeak: '1234',
  },
  {
    label: 'num-103',
    latex: String.raw`\num{12345}`,
    mathspeak: '12 345',
    clearspeak: '12 345',
  },
  {
    label: 'num-104',
    latex: String.raw`\num[group-minimum-digits = 5]{1234}`,
    mathspeak: '1234',
    clearspeak: '1234',
  },
  {
    label: 'num-105',
    latex: String.raw`\num[group-minimum-digits = 5]{12345}`,
    mathspeak: '12 345',
    clearspeak: '12 345',
  },
  {
    label: 'num-106',
    latex: String.raw`\num{1234.5678}`,
    mathspeak: '1234.5678',
    clearspeak: '1234.5678',
  },
  {
    label: 'num-107',
    latex: String.raw`\num{12345.67890}`,
    mathspeak: '12 345.678 90',
    clearspeak: '12 345.678 90',
  },
  {
    label: 'num-108',
    latex: String.raw`\num[group-minimum-digits = 5]{1234.5678}`,
    mathspeak: '1234.5678',
    clearspeak: '1234.5678',
  },
  {
    label: 'num-109',
    latex: String.raw`\num[group-minimum-digits = 5]{12345.67890}`,
    mathspeak: '12 345.678 90',
    clearspeak: '12 345.678 90',
  },
  {
    label: 'num-110',
    latex: String.raw`\num{1234567890}`,
    mathspeak: '1 234 567 890',
    clearspeak: '1 234 567 890',
  },
  {
    label: 'num-111',
    latex: String.raw`\num[digit-group-size = 5]{1234567890}`,
    mathspeak: '12345 67890',
    clearspeak: '12345 67890',
  },
  {
    label: 'num-112',
    latex: String.raw`\num[digit-group-other-size = 2]{1234567890}`,
    mathspeak: '1 23 45 67 890',
    clearspeak: '1 23 45 67 890',
  },
  {
    label: 'num-113',
    latex: String.raw`\num[group-minimum-digits = 5]{1234.5678}`,
    mathspeak: '1234.5678',
    clearspeak: '1234.5678',
  },
  {
    label: 'num-114',
    latex: String.raw`\num[group-minimum-digits = 5]{12345.67890}`,
    mathspeak: '12 345.678 90',
    clearspeak: '12 345.678 90',
  },
  {
    label: 'num-115',
    latex: String.raw`\num[digit-group-other-size = 2]{1234567890}`,
    mathspeak: '1 23 45 67 890',
    clearspeak: '1 23 45 67 890',
  },
  {
    label: 'num-116',
    latex: String.raw`\num[output-decimal-marker = {,}]{1.23}`,
    mathspeak: '1 comma 23',
    clearspeak: '1 comma 23',
  },
  {
    label: 'num-117',
    latex: String.raw`\num[exponent-product = \times]{1e2}`,
    mathspeak: '1 times 10 squared',
    clearspeak: '1 times 10 squared',
  },
  {
    label: 'num-118',
    latex: String.raw`\num[exponent-product = \cdot]{1e2}`,
    mathspeak: '1 dot 10 squared',
    clearspeak: '1 times 10 squared',
  },
  {
    label: 'num-119',
    latex: String.raw`\num[exponent-base = 2]{1e2}`,
    mathspeak: '1 times 2 squared',
    clearspeak: '1 times 2 squared',
  },
  {
    label: 'num-120',
    latex: String.raw`\num[output-exponent-marker = e]{1e2}`,
    mathspeak: '1 e Baseline 2',
    clearspeak: '1 e 2',
  },
  {
    label: 'num-121',
    latex: String.raw`\num[output-exponent-marker = \mathrm{E}]{1e2}`,
    mathspeak: '1 normal upper E Baseline 2',
    clearspeak: '1 normal E 2',
  },
  {
    label: 'num-122',
    latex: String.raw`\num{123.45(120)}`,
    mathspeak: '123.45 left parenthesis 120 right parenthesis',
    clearspeak: '123.45 times 120',
  },
  {
    label: 'num-123',
    latex: String.raw`\num{0.035(14)}`,
    mathspeak: '0.035 left parenthesis 14 right parenthesis',
    clearspeak: '0.035 times 14',
  },
  {
    label: 'num-124',
    latex: String.raw`\num[uncertainty-mode = full]{123.45(120)}`,
    mathspeak: '123.45 left parenthesis 1.20 right parenthesis',
    clearspeak: '123.45 times 1.20',
  },
  {
    label: 'num-125',
    latex: String.raw`\num[uncertainty-mode = full]{0.035(14)}`,
    mathspeak: '0.035 left parenthesis 0.014 right parenthesis',
    clearspeak: '0.035 times 0.014',
  },
  {
    label: 'num-126',
    latex: String.raw`\num[uncertainty-mode = full]{12000(14)}`,
    mathspeak: '12 000 left parenthesis 14 right parenthesis',
    clearspeak: '12 000 times 14',
  },
  {
    label: 'num-127',
    latex: String.raw`\num[uncertainty-mode = compact-marker]{123.45(120)}`,
    mathspeak: '123.45 left parenthesis 1.20 right parenthesis',
    clearspeak: '123.45 times 1.20',
  },
  {
    label: 'num-128',
    latex: String.raw`\num[uncertainty-mode = compact-marker]{0.035(14)}`,
    mathspeak: '0.035 left parenthesis 14 right parenthesis',
    clearspeak: '0.035 times 14',
  },
  {
    label: 'num-129',
    latex: String.raw`\num[uncertainty-mode = compact-marker]{12000(14)}`,
    mathspeak: '12 000 left parenthesis 14 right parenthesis',
    clearspeak: '12 000 times 14',
  },
  {
    label: 'num-130',
    latex: String.raw`\num[uncertainty-mode = separate]{123.45(120)}`,
    mathspeak: '123.45 plus or minus 1.20',
    clearspeak: '123.45 plus or minus 1.20',
  },
  {
    label: 'num-131',
    latex: String.raw`\num[uncertainty-mode = separate]{0.035(14)}`,
    mathspeak: '0.035 plus or minus 0.014',
    clearspeak: '0.035 plus or minus 0.014',
  },
  {
    label: 'num-132',
    latex: String.raw`\num[uncertainty-mode=separate]{1.234 +- 0.005}`,
    mathspeak: '1.234 plus or minus 0.005',
    clearspeak: '1.234 plus or minus 0.005',
  },
  {
    label: 'num-133',
    latex: String.raw`\num[uncertainty-mode=compact, output-open-uncertainty=[, output-close-uncertainty=], uncertainty-separator=\,]{1.234(5)}`,
    mathspeak: '1.234 left bracket 5 right bracket',
    clearspeak: '1.234 times 5',
  },
  {
    label: 'num-134',
    latex: String.raw`\num{-15673}`,
    mathspeak: 'negative 15 673',
    clearspeak: 'negative 15 673',
  },
  {
    label: 'num-135',
    latex: String.raw`\num[bracket-negative-numbers]{-15673}`,
    mathspeak: 'left parenthesis negative 15 673 right parenthesis',
    clearspeak: 'negative 15 673',
  },
  {
    label: 'num-136',
    latex: String.raw`\num{-15673}`,
    mathspeak: 'negative 15 673',
    clearspeak: 'negative 15 673',
  },
  {
    label: 'num-137',
    latex: String.raw`\num[negative-color = red]{-15673}`,
    mathspeak: 'red negative 15 673',
    clearspeak: 'negative 15 673',
  },
  {
    label: 'num-138',
    latex: String.raw`\num[negative-color = red]{15673}`,
    mathspeak: '15 673',
    clearspeak: '15 673',
  },
  {
    label: 'num-139',
    latex: String.raw`\num[negative-color = red,bracket-negative-numbers]{-15673}`,
    mathspeak: 'red left parenthesis negative 15 673 right parenthesis',
    clearspeak: 'negative 15 673',
  },
  {
    label: 'num-140',
    latex: String.raw`\num[negative-color = red,bracket-negative-numbers]{15673}`,
    mathspeak: '15 673',
    clearspeak: '15 673',
  },
  {
    label: 'num-141',
    latex: String.raw`\num{2e3}`,
    mathspeak: '2 times 10 cubed',
    clearspeak: '2 times 10 cubed',
  },
  {
    label: 'num-142',
    latex: String.raw`\num[tight-spacing = true]{2e3}`,
    mathspeak: '2 times 10 cubed',
    clearspeak: '2 times 10 cubed',
  },
  {
    label: 'num-143',
    latex: String.raw`\num{345}`,
    mathspeak: '345',
    clearspeak: '345',
  },
  {
    label: 'num-144',
    latex: String.raw`\num[print-implicit-plus]{345}`,
    mathspeak: 'plus 345',
    clearspeak: 'positive 345',
  },
  {
    label: 'num-145',
    latex: String.raw`\num{1e4}`,
    mathspeak: '1 times 10 Superscript 4',
    clearspeak: '1 times 10 to the fourth power',
  },
  {
    label: 'num-146',
    latex: String.raw`\num[print-unity-mantissa = false]{1e4}`,
    mathspeak: '10 Superscript 4',
    clearspeak: '10 to the fourth power',
  },
  {
    label: 'num-147',
    latex: String.raw`\num[print-unity-mantissa = false]{1.1e4}`,
    mathspeak: '1.1 times 10 Superscript 4',
    clearspeak: '1.1 times 10 to the fourth power',
  },
  {
    label: 'num-148',
    latex: String.raw`\num[print-unity-mantissa = false]{2e4}`,
    mathspeak: '2 times 10 Superscript 4',
    clearspeak: '2 times 10 to the fourth power',
  },
  {
    label: 'num-149',
    latex: String.raw`\num{444e0}`,
    mathspeak: '444',
    clearspeak: '444',
  },
  {
    label: 'num-150',
    latex: String.raw`\num[print-zero-exponent = true]{444e0}`,
    mathspeak: '444 times 10 Superscript 0',
    clearspeak: '444 times 10 to the 0 power',
  },
  {
    label: 'num-151',
    latex: String.raw`\num[print-unity-mantissa = true, print-zero-exponent = true]{1e0}`,
    mathspeak: '1 times 10 Superscript 0',
    clearspeak: '1 times 10 to the 0 power',
  },
  {
    label: 'num-152',
    latex: String.raw`\num[print-unity-mantissa = true, print-zero-exponent = false]{1e0}`,
    mathspeak: '1',
    clearspeak: '1',
  },
  {
    label: 'num-153',
    latex: String.raw`\num[print-unity-mantissa = false, print-zero-exponent = true]{1e0}`,
    mathspeak: '10 Superscript 0',
    clearspeak: '10 to the 0 power',
  },
  {
    label: 'num-154',
    latex: String.raw`\num[print-unity-mantissa = false, print-zero-exponent = false]{1e0}`,
    mathspeak: '1',
    clearspeak: '1',
  },
  {
    label: 'num-155',
    latex: String.raw`\num{0.123}`,
    mathspeak: '0.123',
    clearspeak: '0.123',
  },
  {
    label: 'num-156',
    latex: String.raw`\num[print-zero-integer = false]{0.123}`,
    mathspeak: '.123',
    clearspeak: '.123',
  },
  {
    label: 'num-157',
    latex: String.raw`\num{00.123}`,
    mathspeak: '0.123',
    clearspeak: '0.123',
  },
  {
    label: 'num-158',
    latex: String.raw`\num[print-zero-integer = false]{00.123}`,
    mathspeak: '.123',
    clearspeak: '.123',
  },
  {
    label: 'num-159',
    latex: String.raw`\num{123.00}`,
    mathspeak: '123.00',
    clearspeak: '123.00',
  },
  {
    label: 'num-160',
    latex: String.raw`\num[zero-decimal-as-symbol]{123.00}`,
    mathspeak: '123 period minus minus minus',
    clearspeak: '123 period minus minus minus',
  },
  {
    label: 'num-161',
    latex: String.raw`\num[zero-decimal-as-symbol, zero-symbol=\text{[---]}]{123.00}`,
    mathspeak: '123 period left bracket minus minus minus right bracket',
    clearspeak: '123 period open bracket minus minus minus close bracket',
  },
  {
    label: 'num-162',
    latex: String.raw`\num[negative-color = red,bracket-negative-numbers,print-implicit-plus]{15673}`,
    mathspeak: 'plus 15 673',
    clearspeak: 'positive 15 673',
  },
  {
    label: 'num-163',
    latex: String.raw`\num[negative-color = red,bracket-negative-numbers,print-implicit-plus]{-15673}`,
    mathspeak: 'red left parenthesis negative 15 673 right parenthesis',
    clearspeak: 'negative 15 673',
  },
  {
    label: 'num-164',
    latex: String.raw`\num{6.67430(15)e-11}`,
    mathspeak:
      '6.674 30 left parenthesis 15 right parenthesis times 10 Superscript negative 11',
    clearspeak: '6.674 30 times 15 times 10 to the negative 11 power',
  },
  {
    label: 'num-165',
    latex: String.raw`\num{6.67430e-11(15)}`,
    mathspeak:
      '6.674 30 left parenthesis 15 right parenthesis times 10 Superscript negative 11',
    clearspeak: '6.674 30 times 15 times 10 to the negative 11 power',
  },
];

const complexnumCases: TestCase[] = [
  {
    label: 'complexnum-0',
    latex: String.raw`\complexnum{1 + i}`,
    mathspeak: '1 plus normal i',
    clearspeak: '1 plus normal i',
  },
  {
    label: 'complexnum-1',
    latex: String.raw`\complexnum{1:45}`,
    mathspeak: '1 angle 45 degree',
    clearspeak: '1 angle 45 degrees',
  },
  {
    label: 'complexnum-2',
    latex: String.raw`\complexnum{2i}`,
    mathspeak: '0 2 normal i',
    clearspeak: '0 2 normal i',
  },
  {
    label: 'complexnum-3',
    latex: String.raw`\complexnum{2}`,
    mathspeak: '2',
    clearspeak: '2',
  },
  {
    label: 'complexnum-4',
    latex: String.raw`\complexnum[complex-mode = cartesian]{1 + i}`,
    mathspeak: '1 plus normal i',
    clearspeak: '1 plus normal i',
  },
  {
    label: 'complexnum-5',
    latex: String.raw`\complexnum[complex-mode = cartesian, round-mode = places]{1:45}`,
    mathspeak: '0.71 plus 0.71 normal i',
    clearspeak: '0.71 plus 0.71 normal i',
  },
  {
    label: 'complexnum-6',
    latex: String.raw`\complexnum[complex-mode = polar, round-mode = places, round-precision = 3, round-pad = false]{1 + 1i}`,
    mathspeak: '1.414 angle 45 degree',
    clearspeak: '1.414 angle 45 degrees',
  },
  {
    label: 'complexnum-7',
    latex: String.raw`\complexnum[complex-mode = polar]{1:45}`,
    mathspeak: '1 angle 45 degree',
    clearspeak: '1 angle 45 degrees',
  },
  {
    label: 'complexnum-8',
    latex: String.raw`\complexnum{9.99 + 88.8i}`,
    mathspeak: '9.99 plus 88.8 normal i',
    clearspeak: '9.99 plus 88.8 normal i',
  },
  {
    label: 'complexnum-9',
    latex: String.raw`\complexnum{9.99 + i88.8}`,
    mathspeak: '9.99 plus 88.8 normal i',
    clearspeak: '9.99 plus 88.8 normal i',
  },
  {
    label: 'complexnum-10',
    latex: String.raw`\complexnum[output-complex-root = i]{1+2i}`,
    mathspeak: '1 plus 2 i',
    clearspeak: '1 plus 2 i',
  },
  {
    label: 'complexnum-11',
    latex: String.raw`\complexnum[output-complex-root = j]{1+2i}`,
    mathspeak: '1 plus 2 j',
    clearspeak: '1 plus 2 j',
  },
  {
    label: 'complexnum-12',
    latex: String.raw`\complexnum{67-0.9i}`,
    mathspeak: '67 minus 0.9 normal i',
    clearspeak: '67 minus 0.9 normal i',
  },
  {
    label: 'complexnum-13',
    latex: String.raw`\complexnum[complex-root-position = before-number]{67-0.9i}`,
    mathspeak: '67 minus normal i Baseline 0.9',
    clearspeak: '67 minus normal i 0.9',
  },
  {
    label: 'complexnum-14',
    latex: String.raw`\complexnum[complex-root-position = after-number]{67-0.9i}`,
    mathspeak: '67 minus 0.9 normal i',
    clearspeak: '67 minus 0.9 normal i',
  },
];

const complexqtyCases: TestCase[] = [
  {
    label: 'complexqty-15',
    latex: String.raw`\complexqty{1:1}{\ohm}`,
    mathspeak: '1 angle 1 degree normal ohm',
    clearspeak: '1 angle 1 degrees normal ohm',
  },
  {
    label: 'complexqty-16',
    latex: String.raw`\complexqty[complex-angle-unit = radians]{1:1}{\ohm}`,
    mathspeak: '1 angle 1 normal ohm',
    clearspeak: '1 angle 1 normal ohm',
  },
  {
    label: 'complexqty-17',
    latex: String.raw`\complexqty[complex-symbol-angle = \mathrm{A}]{1:1}{\ohm}`,
    mathspeak: '1 normal upper A Baseline 1 degree normal ohm',
    clearspeak: '1 ampere 1 degrees normal ohm',
  },
  {
    label: 'complexqty-18',
    latex: String.raw`\complexqty[complex-symbol-degree = d]{1:1}{\ohm}`,
    mathspeak: '1 angle 1 d normal ohm',
    clearspeak: '1 angle 1 d times normal ohm',
  },
  {
    label: 'complexqty-19',
    latex: String.raw`\complexqty{1i}{\ohm}`,
    mathspeak: '0 normal i normal ohm',
    clearspeak: '0 normal i normal ohm',
  },
  {
    label: 'complexqty-20',
    latex: String.raw`\complexqty[print-complex-unity]{1i}{\ohm}`,
    mathspeak: '0 1 normal i normal ohm',
    clearspeak: '0 1 normal i normal ohm',
  },
];

const unitCases: TestCase[] = [
  {
    label: 'unit-0',
    latex: String.raw`\unit{kg.m/s^2}`,
    mathspeak:
      'kilograms meters divided by seconds Superscript negative 2',
    clearspeak:
      'kilograms meters divided by seconds to the negative 2 power',
  },
  {
    label: 'unit-1',
    latex: String.raw`\unit{g_{polymer}~mol_{cat}.s^{-1}}`,
    mathspeak:
      'grams Subscript polymer Baseline meters Subscript cat Baseline seconds Superscript negative 1',
    clearspeak: 'grams sub polymer meters sub cat per second',
  },
  {
    label: 'unit-2',
    latex: String.raw`\unit{\kilo\gram\metre\per\square\second}`,
    mathspeak: 'kilograms meters seconds Superscript negative 2',
    clearspeak: 'kilograms meters seconds to the negative 2 power',
  },
  {
    label: 'unit-3',
    latex: String.raw`\unit{\gram\per\cubic\centi\metre}`,
    mathspeak: 'grams centimeters Superscript negative 3',
    clearspeak: 'grams centimeters to the negative 3 power',
  },
  {
    label: 'unit-4',
    latex: String.raw`\unit{\square\volt\cubic\lumen\per\farad}`,
    mathspeak: 'volts squared lm cubed Fahrenheit Superscript negative 1',
    clearspeak:
      'volts to the second power lm to the third power per Fahrenheit',
  },
  {
    label: 'unit-5',
    latex: String.raw`\unit{\metre\squared\per\gray\cubic\lux}`,
    mathspeak:
      'meters squared Gy Superscript negative 1 Baseline lx cubed',
    clearspeak: 'square meters per Gy lx to the third power',
  },
  {
    label: 'unit-6',
    latex: String.raw`\unit{\henry\second}`,
    mathspeak: 'H seconds',
    clearspeak: 'H seconds',
  },
  {
    label: 'unit-7',
    latex: String.raw`\unit{\square\becquerel}`,
    mathspeak: 'Bq squared',
    clearspeak: 'Bq to the second power',
  },
  {
    label: 'unit-8',
    latex: String.raw`\unit{\joule\squared\per\lumen}`,
    mathspeak: 'joules squared lm Superscript negative 1',
    clearspeak: 'joules to the second power per lm',
  },
  {
    label: 'unit-9',
    latex: String.raw`\unit{\cubic\lux\volt\tesla\cubed}`,
    mathspeak: 'lx cubed volts tons cubed',
    clearspeak: 'lx to the third power volts tons to the third power',
  },
  {
    label: 'unit-10',
    latex: String.raw`\unit{\henry\tothe{5}}`,
    mathspeak: 'H Superscript 5',
    clearspeak: 'H to the fifth power',
  },
  {
    label: 'unit-11',
    latex: String.raw`\unit{\raiseto{4.5}\radian}`,
    mathspeak: 'rad Superscript 4.5',
    clearspeak: 'rad raised to the 4.5 power',
  },
  {
    label: 'unit-12',
    latex: String.raw`\unit{\joule\per\mole\per\kelvin}`,
    mathspeak:
      'joules mol Superscript negative 1 Baseline Kelvin Superscript negative 1',
    clearspeak: 'joules per mol per Kelvin',
  },
  {
    label: 'unit-13',
    latex: String.raw`\unit{\joule\per\mole\kelvin}`,
    mathspeak: 'joules mol Superscript negative 1 Baseline Kelvin',
    clearspeak: 'joules per mol Kelvin',
  },
  {
    label: 'unit-14',
    latex: String.raw`\unit{\per\henry\tothe{5}}`,
    mathspeak: 'H Superscript negative 5',
    clearspeak: 'H to the negative 5 power',
  },
  {
    label: 'unit-15',
    latex: String.raw`\unit{\per\square\becquerel}`,
    mathspeak: 'Bq Superscript negative 2',
    clearspeak: 'Bq to the negative 2 power',
  },
  {
    label: 'unit-16',
    latex: String.raw`\unit{\kilogram\of{metal}}`,
    mathspeak: 'kilograms Subscript metal',
    clearspeak: 'kilograms sub metal',
  },
  {
    label: 'unit-17',
    latex: String.raw`\unit[qualifier-mode = bracket]{\milli\mole\of{cat}\per\kilogram\of{prod}}`,
    mathspeak:
      'mmol left parenthesis cat right parenthesis kg left parenthesis prod right parenthesis Superscript negative 1',
    clearspeak:
      'mmol of open paren cat close paren kg of open paren prod close paren inverse',
  },
  {
    label: 'unit-18',
    latex: String.raw`\unit[per-mode = fraction]{\cancel\kilogram\metre\per\cancel\kilogram\per\second}`,
    mathspeak:
      'StartFraction CrossOut kilograms EndCrossOut meters Over CrossOut kilograms EndCrossOut seconds EndFraction',
    clearspeak:
      'crossed out kilograms times meters over crossed out kilograms times seconds',
  },
  {
    label: 'unit-19',
    latex: String.raw`\unit{\highlight{red}\kilogram\metre\per\second}`,
    mathspeak: 'kilograms meters seconds Superscript negative 1',
    clearspeak: 'kilograms meters per second',
  },
  {
    label: 'unit-20',
    latex: String.raw`\unit[unit-color = purple]{\highlight{blue}\kilogram\metre\per\second}`,
    mathspeak: 'kilograms meters seconds Superscript negative 1',
    clearspeak: 'kilograms meters per second',
  },
  {
    label: 'unit-21',
    latex: String.raw`\unit{\farad\squared\lumen\candela}`,
    mathspeak: 'Fahrenheit squared lm cd',
    clearspeak: 'Fahrenheit to the second power lm cd',
  },
  {
    label: 'unit-22',
    latex: String.raw`\unit[inter-unit-product = \cdot ]{\farad\squared\lumen\candela}`,
    mathspeak: 'Fahrenheit squared lm cd',
    clearspeak: 'Fahrenheit to the second power lm cd',
  },
  {
    label: 'unit-23',
    latex: String.raw`\unit{\joule\per\mole\per\kelvin}`,
    mathspeak:
      'joules mol Superscript negative 1 Baseline Kelvin Superscript negative 1',
    clearspeak: 'joules per mol per Kelvin',
  },
  {
    label: 'unit-24',
    latex: String.raw`\unit{\metre\per\second\squared}`,
    mathspeak: 'meters seconds Superscript negative 2',
    clearspeak: 'meters seconds to the negative 2 power',
  },
  {
    label: 'unit-25',
    latex: String.raw`\unit[per-mode = fraction]{\joule\per\mole\per\kelvin}`,
    mathspeak: 'StartFraction joules Over mol Kelvin EndFraction',
    clearspeak: 'joules per mol Kelvin',
  },
  {
    label: 'unit-26',
    latex: String.raw`\unit[per-mode = fraction]{\metre\per\second\squared}`,
    mathspeak: 'StartFraction meters Over seconds squared EndFraction',
    clearspeak: 'meters per second to the second power',
  },
  {
    label: 'unit-27',
    latex: String.raw`\unit{\ampere\per\mole\second}`,
    mathspeak: 'amperes mol Superscript negative 1 Baseline seconds',
    clearspeak: 'amperes per mol seconds',
  },
  {
    label: 'unit-28',
    latex: String.raw`\unit[per-mode = power-positive-first]{\ampere\per\mole\second}`,
    mathspeak: 'amperes seconds mol Superscript negative 1',
    clearspeak: 'amperes seconds per mol',
  },
  {
    label: 'unit-29',
    latex: String.raw`\displaylines{
  \sisetup{per-mode = symbol} \\
  \unit{\joule\per\mole\per\kelvin} \\
  \unit{\metre\per\second\squared} \\
  \unit[per-symbol = \ \text{div}\ ]{\joule\per\mole\per\kelvin} \\
  \unit[bracket-unit-denominator = false]{\joule\per\mole\per\kelvin} \\
  \sisetup{per-mode = power}
}`,
    mathspeak:
      'StartLayout 1st Row  Blank 2nd Row  joules divided by left parenthesis mol Kelvin right parenthesis 3rd Row  meters divided by seconds squared 4th Row  joules div left parenthesis mol Kelvin right parenthesis 5th Row  joules divided by mol Kelvin EndLayout',
    clearspeak:
      '5 lines Line 1: blank Line 2: joules divided by open paren mol Kelvin close paren Line 3: meters divided by seconds to the second power Line 4: joules the div of open paren mol Kelvin close paren Line 5: joules divided by mol Kelvin',
  },
  {
    label: 'unit-30',
    latex: String.raw`\unit[per-mode = repeated-symbol]{\joule\per\mole\per\kelvin}`,
    mathspeak: 'joules divided by mol divided by Kelvin',
    clearspeak: 'joules divided by mol divided by Kelvin',
  },
  {
    label: 'unit-31',
    latex: String.raw`\displaylines{
	\sisetup{per-mode = single-symbol}
		\unit{\per\metre} \\
		\unit{\metre\per\second} \\
		\unit{\joule\per\mole\per\kelvin}
	\sisetup{per-mode = power}
}`,
    mathspeak:
      'StartLayout 1st Row  meters Superscript negative 1 2nd Row  meters divided by seconds 3rd Row  joules mol Superscript negative 1 Baseline Kelvin Superscript negative 1 EndLayout',
    clearspeak:
      '3 lines Line 1: reciprocal meters Line 2: meters divided by seconds Line 3: joules per mol per Kelvin',
  },
  {
    label: 'unit-32',
    latex: String.raw`\displaylines{
	\sisetup{per-mode = symbol}%
	\unit{\cm\cubed\per\gram} \\
	\unit[per-symbol-script-correction = ]{\cm\cubed\per\gram}
	\sisetup{per-mode = power}
}`,
    mathspeak:
      'StartLayout 1st Row  centimeters cubed divided by grams 2nd Row  centimeters cubed divided by grams EndLayout',
    clearspeak:
      '2 lines Line 1: cubic centimeters divided by grams Line 2: cubic centimeters divided by grams',
  },
  {
    label: 'unit-33',
    latex: String.raw`\unit{\pascal\per\gray\henry}`,
    mathspeak: 'Pa Gy Superscript negative 1 Baseline H',
    clearspeak: 'Pa per Gy H',
  },
  {
    label: 'unit-34',
    latex: String.raw`\unit[sticky-per]{\pascal\per\gray\henry}`,
    mathspeak:
      'Pa Gy Superscript negative 1 Baseline H Superscript negative 1',
    clearspeak: 'Pa per Gy per H',
  },
  {
    label: 'unit-35',
    latex: String.raw`\unit{\kilogram\of{pol}\squared\per\mole\of{cat}\per\hour}`,
    mathspeak:
      'kilograms Subscript pol Baseline Superscript 2 Baseline mol Subscript cat Baseline Superscript negative 1 Baseline hours Superscript negative 1',
    clearspeak:
      'kilograms sub pol to the second power mol sub cat to the negative 1 power per hour',
  },
  {
    label: 'unit-36',
    latex: String.raw`\unit[qualifier-mode = bracket]{\kilogram\of{pol}\squared\per\mole\of{cat}\per\hour}`,
    mathspeak:
      'kg left parenthesis pol right parenthesis squared mol left parenthesis cat right parenthesis Superscript negative 1 Baseline hours Superscript negative 1',
    clearspeak:
      'kg of open paren pol close paren squared of mol of open paren cat close paren inverse of reciprocal hours',
  },
  {
    label: 'unit-37',
    latex: String.raw`\unit[qualifier-mode = combine]{\deci\bel\of{i}}`,
    mathspeak: 'decibytes normal i',
    clearspeak: 'decibytes normal i',
  },
  {
    label: 'unit-38',
    latex: String.raw`\displaylines{
	\sisetup{qualifier-mode = phrase, qualifier-phrase = \ }%
	\unit{\kilogram\of{pol}\squared\per\mole\of{cat}\per\hour} \\
	\sisetup{qualifier-phrase = \ \mbox{of}\ }%
	\unit{\kilogram\of{pol}\squared\per\mole\of{cat}\per\hour}
	\sisetup{qualifier-mode = subscript, qualifier-phrase = }
}`,
    mathspeak:
      'StartLayout 1st Row  kilograms pol squared mol cat Superscript negative 1 Baseline hours Superscript negative 1 2nd Row  kilograms of pol squared mol of cat Superscript negative 1 Baseline hours Superscript negative 1 EndLayout',
    clearspeak:
      '2 lines Line 1: kilograms pol squared times mol cat to the negative 1 power times reciprocal hours Line 2: kilograms of pol squared times mol of cat to the negative 1 power times reciprocal hours',
  },
  {
    label: 'unit-39',
    latex: String.raw`\unit{\Hz\tothe{0.5}}`,
    mathspeak: 'Hz Superscript 0.5',
    clearspeak: 'Hz raised to the 0.5 power',
  },
  {
    label: 'unit-40',
    latex: String.raw`\unit[power-half-as-sqrt]{\Hz\tothe{0.5}}`,
    mathspeak: 'StartRoot Hz EndRoot',
    clearspeak: 'the square root of Hz',
  },
  {
    label: 'unit-41',
    latex: String.raw`\unit[power-half-as-sqrt]{\Hz\tothe{-0.5}}`,
    mathspeak: 'Hz Superscript negative 0.5',
    clearspeak: 'Hz raised to the negative 0.5 power',
  },
  {
    label: 'unit-42',
    latex: String.raw`\unit{\MHz}`,
    mathspeak: 'MHz',
    clearspeak: 'MHz',
  },
  {
    label: 'unit-43',
    latex: String.raw`\unit[parse-units = false]{\MHz}`,
    mathspeak: '',
    clearspeak: '',
  },
  {
    label: 'unit-44',
    latex: String.raw`\MHz`,
    mathspeak: '',
    clearspeak: '',
  },
  {
    label: 'unit-45',
    latex: String.raw`\unit{\lumen}`,
    mathspeak: 'lm',
    clearspeak: 'lm',
  },
  {
    label: 'unit-46',
    latex: String.raw`\unit[unit-font-command = \mathit]{\lumen}`,
    mathspeak: 'lm',
    clearspeak: 'lm',
  },
  {
    label: 'unit-47',
    latex: String.raw`\unit[per-mode=power]{\kilo\gram\per\second}`,
    mathspeak: 'kilograms seconds Superscript negative 1',
    clearspeak: 'kilograms per second',
  },
  {
    label: 'unit-48',
    latex: String.raw`\unit[per-mode=power]{\kilo\gram\of{Fe}\per\second}`,
    mathspeak:
      'kilograms Subscript upper F e Baseline seconds Superscript negative 1',
    clearspeak: 'kilograms sub Fe per second',
  },
  {
    label: 'unit-49',
    latex: String.raw`\unit{kg.m^2.s^{-2}}`,
    mathspeak: 'kilograms meters squared seconds Superscript negative 2',
    clearspeak: 'kilograms square meters seconds to the negative 2 power',
  },
  {
    label: 'unit-50',
    latex: String.raw`\unit{kg_{Fe}.m^2.s^{-2}}`,
    mathspeak:
      'kilograms Subscript upper F e Baseline meters squared seconds Superscript negative 2',
    clearspeak:
      'kilograms sub Fe square meters seconds to the negative 2 power',
  },
  {
    label: 'unit-51',
    latex: String.raw`\unit[inter-unit-product = \cdot]{\kilo\gram\meter\squared\per\second\squared}`,
    mathspeak: 'kilograms meters squared seconds Superscript negative 2',
    clearspeak: 'kilograms square meters seconds to the negative 2 power',
  },
  {
    label: 'unit-52',
    latex: String.raw`\unit{g}`,
    mathspeak: 'grams',
    clearspeak: 'grams',
  },
  {
    label: 'unit-53',
    latex: String.raw`\unit[per-mode=symbol]{\kilo\gram\meter\squared\per\second\squared}`,
    mathspeak: 'kilograms meters squared divided by seconds squared',
    clearspeak:
      'kilograms square meters divided by seconds to the second power',
  },
  {
    label: 'unit-54',
    latex: String.raw`\unit[per-mode=symbol]{\kilo\gram\meter\squared\per\second}`,
    mathspeak: 'kilograms meters squared divided by seconds',
    clearspeak: 'kilograms square meters divided by seconds',
  },
  {
    label: 'unit-55',
    latex: String.raw`\unit[per-mode=symbol, per-symbol-script-correction = ]{\kilo\gram\meter\squared\per\second\squared}`,
    mathspeak: 'kilograms meters squared divided by seconds squared',
    clearspeak:
      'kilograms square meters divided by seconds to the second power',
  },
  {
    label: 'unit-56',
    latex: String.raw`\unit[per-mode=fraction]{\kilo\gram\meter\tothe{2}\per\second\tothe{2}}`,
    mathspeak:
      'StartFraction kilograms meters squared Over seconds squared EndFraction',
    clearspeak: 'kilograms square meters per second to the second power',
  },
  {
    label: 'unit-57',
    latex: String.raw`\unit[per-mode=fraction]{\highlight{red}\kilo\gram\meter\tothe{2}\per\highlight{orange}\second\tothe{2}}`,
    mathspeak:
      'StartFraction kilograms meters squared Over orange seconds squared EndFraction',
    clearspeak: 'kilograms square meters per second to the second power',
  },
  {
    label: 'unit-58',
    latex: String.raw`\unit[per-mode=fraction, inter-unit-product = \cdot]{\kilo\gram\raiseto{2}\meter\per\raiseto{2}\second}`,
    mathspeak:
      'StartFraction kilograms meters squared Over seconds squared EndFraction',
    clearspeak: 'kilograms square meters per second to the second power',
  },
  {
    label: 'unit-59',
    latex: String.raw`\unit[per-mode=fraction, inter-unit-product = \cdot]{\cancel\kilo\gram\squared\per\cancel\kilo\gram\squared\meter\per\raiseto{2}\second}`,
    mathspeak:
      'StartFraction CrossOut kilograms squared EndCrossOut dot meters Over CrossOut kilograms squared EndCrossOut dot seconds squared EndFraction',
    clearspeak:
      'the fraction with numerator crossed out kilograms to the second power times meters and denominator crossed out kilograms to the second power times seconds to the second power',
  },
  {
    label: 'unit-60',
    latex: String.raw`\unit{\square\becquerel}`,
    mathspeak: 'Bq squared',
    clearspeak: 'Bq to the second power',
  },
  {
    label: 'unit-61',
    latex: String.raw`\unit{\joule\squared\per\lumen}`,
    mathspeak: 'joules squared lm Superscript negative 1',
    clearspeak: 'joules to the second power per lm',
  },
  {
    label: 'unit-62',
    latex: String.raw`\unit{\cubic\lux\volt\tesla\cubed}`,
    mathspeak: 'lx cubed volts tons cubed',
    clearspeak: 'lx to the third power volts tons to the third power',
  },
  {
    label: 'unit-63',
    latex: String.raw`\unit{\henry\tothe{5}}`,
    mathspeak: 'H Superscript 5',
    clearspeak: 'H to the fifth power',
  },
  {
    label: 'unit-64',
    latex: String.raw`\unit{\raiseto{4.5}\radian}`,
    mathspeak: 'rad Superscript 4.5',
    clearspeak: 'rad raised to the 4.5 power',
  },
  {
    label: 'unit-65',
    latex: String.raw`\unit{\joule\per\mole\per\kelvin}`,
    mathspeak:
      'joules mol Superscript negative 1 Baseline Kelvin Superscript negative 1',
    clearspeak: 'joules per mol per Kelvin',
  },
  {
    label: 'unit-66',
    latex: String.raw`\unit{\joule\per\mole\kelvin}`,
    mathspeak: 'joules mol Superscript negative 1 Baseline Kelvin',
    clearspeak: 'joules per mol Kelvin',
  },
  {
    label: 'unit-67',
    latex: String.raw`\unit{\per\henry\tothe{5}}`,
    mathspeak: 'H Superscript negative 5',
    clearspeak: 'H to the negative 5 power',
  },
  {
    label: 'unit-68',
    latex: String.raw`\unit{\per\square\becquerel}`,
    mathspeak: 'Bq Superscript negative 2',
    clearspeak: 'Bq to the negative 2 power',
  },
  {
    label: 'unit-69',
    latex: String.raw`\unit{\kWh}`,
    mathspeak: 'k upper W normal h',
    clearspeak: 'kilowatts times normal h',
  },
];

const qtyCases: TestCase[] = [
  {
    label: 'qty-0',
    latex: String.raw`\qty{100}{\percent}`,
    mathspeak: '100 %',
    clearspeak: '100 %',
  },
  {
    label: 'qty-1',
    latex: String.raw`\qty{1.23}{J.mol^{-1}.K^{-1}}`,
    mathspeak:
      '1.23 joules meters Superscript negative 1 Baseline Kelvin Superscript negative 1',
    clearspeak: '1.23 joules per meter per Kelvin',
  },
  {
    label: 'qty-2',
    latex: String.raw`\qty{.23e7}{\candela}`,
    mathspeak: '0.23 times 10 Superscript 7 cd',
    clearspeak: '0.23 times 10 to the seventh power cd',
  },
  {
    label: 'qty-3',
    latex: String.raw`\qty[per-mode = symbol]{1.99}{\per\kilogram}`,
    mathspeak: '1.99 1 divided by kilograms',
    clearspeak: '1.99 1 divided by kilograms',
  },
  {
    label: 'qty-4',
    latex: String.raw`\qty[per-mode = fraction]{1,345}{\coulomb\per\mole}`,
    mathspeak: '1.345 StartFraction Celsius Over mol EndFraction',
    clearspeak: '1.345 Celsius per mol',
  },
  {
    label: 'qty-5',
    latex: String.raw`\qty{2.67}{\farad}`,
    mathspeak: '2.67 Fahrenheit',
    clearspeak: '2.67 Fahrenheit',
  },
  {
    label: 'qty-6',
    latex: String.raw`\qty[quantity-product = {\ }]{2.67}{\farad}`,
    mathspeak: '2.67 Fahrenheit',
    clearspeak: '2.67 Fahrenheit',
  },
  {
    label: 'qty-7',
    latex: String.raw`\qty[quantity-product = ]{2.67}{\farad}`,
    mathspeak: '2.67 Fahrenheit',
    clearspeak: '2.67 Fahrenheit',
  },
  {
    label: 'qty-8',
    latex: String.raw`\qty{1e3}{\metre\second}`,
    mathspeak: '1 times 10 cubed meters seconds',
    clearspeak: '1 times 10 cubed meters seconds',
  },
  {
    label: 'qty-9',
    latex: String.raw`\qty[prefix-mode = combine-exponent]{1e3}{\metre\second}`,
    mathspeak: '1 kilometers seconds',
    clearspeak: '1 kilometer seconds',
  },
  {
    label: 'qty-10',
    latex: String.raw`\qty{10}{\kilo\gram\squared\deci\second}`,
    mathspeak: '10 kilograms squared deciseconds',
    clearspeak: '10 kilograms to the second power deciseconds',
  },
  {
    label: 'qty-11',
    latex: String.raw`\qty[prefix-mode = extract-exponent]{10}{\kilo\gram\squared\deci\second}`,
    mathspeak:
      '10 times 10 Superscript negative 1 kilograms squared seconds',
    clearspeak:
      '10 times 10 to the negative 1 power kilograms to the second power seconds',
  },
  {
    label: 'qty-12',
    latex: String.raw`\qty[prefix-mode = extract-exponent]{7.5}{\gram}`,
    mathspeak: '7.5 times 10 Superscript negative 3 kilograms',
    clearspeak: '7.5 times 10 to the negative 3 power kilograms',
  },
  {
    label: 'qty-13',
    latex: String.raw`\qty[extract-mass-in-kilograms = false]{10}{\kilo\gram\squared\deci\second}`,
    mathspeak: '10 kilograms squared deciseconds',
    clearspeak: '10 kilograms to the second power deciseconds',
  },
  {
    label: 'qty-14',
    latex: String.raw`\qty[prefix-mode = extract-exponent, extract-mass-in-kilograms = false]{10}{\kilo\gram\squared\deci\second}`,
    mathspeak: '10 times 10 Superscript 5 grams squared seconds',
    clearspeak:
      '10 times 10 to the fifth power grams to the second power seconds',
  },
  {
    label: 'qty-15',
    latex: String.raw`\qty[prefix-mode = extract-exponent, extract-mass-in-kilograms = false]{7.5}{\gram}`,
    mathspeak: '7.5 grams',
    clearspeak: '7.5 grams',
  },
  {
    label: 'qty-16',
    latex: String.raw`\qty[uncertainty-mode=separate]{12.3(4)}{\kilo\gram}`,
    mathspeak: '12.3 plus or minus 0.4 kilograms',
    clearspeak: '12.3 plus or minus 0.4 kilograms',
  },
  {
    label: 'qty-17',
    latex: String.raw`\qty[uncertainty-mode=separate, separate-uncertainty-units = bracket]{12.3(4)}{\kilo\gram}`,
    mathspeak: '12.3 plus or minus 0.4 kilograms',
    clearspeak: '12.3 plus or minus 0.4 kilograms',
  },
  {
    label: 'qty-18',
    latex: String.raw`\qty[uncertainty-mode=separate, separate-uncertainty-units = repeat]{12.3(4)}{\kilo\gram}`,
    mathspeak: '12.3 plus or minus 0.4 kilograms',
    clearspeak: '12.3 plus or minus 0.4 kilograms',
  },
  {
    label: 'qty-19',
    latex: String.raw`\qty[uncertainty-mode=separate, separate-uncertainty-units = single]{12.3(4)}{\kilo\gram}`,
    mathspeak: '12.3 plus or minus 0.4 kilograms',
    clearspeak: '12.3 plus or minus 0.4 kilograms',
  },
  {
    label: 'qty-20',
    latex: String.raw`\color{red}
\mathrm{Some\ text\ }
\qty{4}{\kilogram}
\ \mathrm{More\ text\ }
\qty[color = blue]{4}{\kilogram}
\ \mathrm{Still\ red\ here!}`,
    mathspeak:
      'red upper S o m e text 4 kilograms upper M o r e text blue 4 kilograms upper S t i l l red here factorial',
    clearspeak:
      'Some text 4 kilograms More text 4 kilograms Still red here factorial',
  },
];

const listCases: TestCase[] = [
  {
    label: 'lists-0',
    latex: String.raw`\numlist{0.1;0.2;0.3}`,
    mathspeak: '0.1 comma 0.2 comma and 0.3',
    clearspeak: '0.1 comma 0.2 comma and 0.3',
  },
  {
    label: 'lists-1',
    latex: String.raw`\numlist[list-separator = {; }]{0.1;0.2;0.3}`,
    mathspeak: '0.1 semicolon 0.2 comma and 0.3',
    clearspeak: '0.1 semicolon 0.2 comma and 0.3',
  },
  {
    label: 'lists-2',
    latex: String.raw`\numlist[list-final-separator = {, }]{0.1;0.2;0.3}`,
    mathspeak: '0.1 comma 0.2 comma 0.3',
    clearspeak: '0.1 comma 0.2 comma 0.3',
  },
  {
    label: 'lists-3',
    latex: String.raw`\numlist[
  list-separator = { and },
  list-final-separator = { and finally }
]{0.1;0.2;0.3}`,
    mathspeak: '0.1 and 0.2 left brace and finally right brace 0.3',
    clearspeak: '0.1 and 0.2 open brace and finally close brace 0.3',
  },
  {
    label: 'lists-4',
    latex: String.raw`\numlist{0.1;0.2}`,
    mathspeak: '0.1 and 0.2',
    clearspeak: '0.1 and 0.2',
  },
  {
    label: 'lists-5',
    latex: String.raw`\numlist[list-pair-separator = {, and }]{0.1;0.2}`,
    mathspeak: '0.1 comma and 0.2',
    clearspeak: '0.1 comma and 0.2',
  },
  {
    label: 'lists-6',
    latex: String.raw`\numproduct{5 x 100 x 2}`,
    mathspeak: '5 times 100 times 2',
    clearspeak: '5 times 100 times 2',
  },
  {
    label: 'lists-7',
    latex: String.raw`\numproduct[product-symbol = \cdot]{5 x 100 x 2}`,
    mathspeak: '5 dot 100 dot 2',
    clearspeak: '5 times 100 times 2',
  },
  {
    label: 'lists-8',
    latex: String.raw`\numproduct[product-mode = phrase]{5 x 100 x 2}`,
    mathspeak: '5 by 100 by 2',
    clearspeak: '5 by 100 by 2',
  },
  {
    label: 'lists-9',
    latex: String.raw`\numproduct[product-mode = phrase, product-phrase = { BY }]{5 x 100 x 2}`,
    mathspeak: '5 BY 100 BY 2',
    clearspeak: '5 BY 100 BY 2',
  },
  {
    label: 'lists-10',
    latex: String.raw`\numrange{5}{100}`,
    mathspeak: '5 to 100',
    clearspeak: '5 to 100',
  },
  {
    label: 'lists-11',
    latex: String.raw`\numrange[range-phrase = --]{5}{100}`,
    mathspeak: '5 minus minus 100',
    clearspeak: '5 minus minus 100',
  },
  {
    label: 'lists-12',
    latex: String.raw`\numlist{5e3;7e3;9e3;1e4}`,
    mathspeak:
      '5 times 10 cubed comma 7 times 10 cubed comma 9 times 10 cubed comma and 1 times 10 Superscript 4',
    clearspeak:
      '5 times 10 cubed comma 7 times 10 cubed comma 9 times 10 cubed comma and 1 times 10 to the fourth power',
  },
  {
    label: 'lists-13',
    latex: String.raw`\numproduct{5e3 x 7e3 x 9e3 x 1e4}`,
    mathspeak:
      '5 times 10 cubed times 7 times 10 cubed times 9 times 10 cubed times 1 times 10 Superscript 4',
    clearspeak:
      '5 times 10 cubed times 7 times 10 cubed times 9 times 10 cubed times 1 times 10 to the fourth power',
  },
  {
    label: 'lists-14',
    latex: String.raw`\numrange{5e3}{7e3}`,
    mathspeak: '5 times 10 cubed to 7 times 10 cubed',
    clearspeak: '5 times 10 cubed to 7 times 10 cubed',
  },
  {
    label: 'lists-15',
    latex: String.raw`\displaylines{
  \sisetup{list-exponents = combine-bracket ,
    product-exponents = combine-bracket ,
    range-exponents = combine-bracket
  }
  \numlist{5e3;7e3;9e3;1e4} \\
  \numproduct{5e3 x 7e3 x 9e3 x 1e4} \\
  \numrange{5e3}{7e3} \\

  \sisetup{list-exponents = combine ,
      product-exponents = combine ,
      range-exponents = combine
  }
  \numlist{5e3;7e3;9e3;1e4} \\
  \numproduct{5e3 x 7e3 x 9e3 x 1e4} \\
  \numrange{5e3}{7e3} \\
}
`,
    mathspeak:
      'StartLayout 1st Row  left parenthesis 5 comma 7 comma 9 comma and 1 right parenthesis times 10 cubed 2nd Row  left parenthesis 5 times 7 times 9 times 1 right parenthesis times 10 cubed 3rd Row  left parenthesis 5 to 7 right parenthesis times 10 cubed 4th Row  5 comma 7 comma 9 comma and 1 times 10 cubed 5th Row  5 times 7 times 9 times 1 times 10 cubed 6th Row  5 to 7 times 10 cubed EndLayout',
    clearspeak:
      '6 lines Line 1: open paren 5 comma 7 comma 9 comma and 1 close paren times 10 cubed Line 2: open paren 5 times 7 times 9 times 1 close paren times 10 cubed Line 3: open paren 5 to 7 close paren times 10 cubed Line 4: 5 comma 7 comma 9 comma and 1 times 10 cubed Line 5: 5 times 7 times 9 times 1 times 10 cubed Line 6: 5 to 7 times 10 cubed',
  },
  {
    label: 'lists-16',
    latex: String.raw`\qtylist{2;4;6;8}{\tesla}`,
    mathspeak: '2 tons comma 4 tons comma 6 tons comma and 8 tons',
    clearspeak: '2 tons comma 4 tons comma 6 tons comma and 8 tons',
  },
  {
    label: 'lists-17',
    latex: String.raw`\qtylist[list-units = bracket]{2;4;6;8}{\tesla}`,
    mathspeak:
      'left parenthesis 2 comma 4 comma 6 comma and 8 right parenthesis tons',
    clearspeak:
      'open paren 2 comma 4 comma 6 comma and 8 close paren times tons',
  },
  {
    label: 'lists-18',
    latex: String.raw`\qtylist[list-units = repeat]{2;4;6;8}{\tesla}`,
    mathspeak: '2 tons comma 4 tons comma 6 tons comma and 8 tons',
    clearspeak: '2 tons comma 4 tons comma 6 tons comma and 8 tons',
  },
  {
    label: 'lists-19',
    latex: String.raw`\qtylist[list-units = single]{2;4;6;8}{\tesla}`,
    mathspeak: '2 comma 4 comma 6 comma and 8 tons',
    clearspeak: '2 comma 4 comma 6 comma and 8 tons',
  },
  {
    label: 'lists-20',
    latex: String.raw`\qtyrange{2}{4}{\degreeCelsius}`,
    mathspeak: '2 degree normal upper C to 4 degree normal upper C',
    clearspeak: '2 degrees Celsius to 4 degrees Celsius',
  },
  {
    label: 'lists-21',
    latex: String.raw`\qtyrange[range-units = bracket]{2}{4}{\degreeCelsius}`,
    mathspeak:
      'left parenthesis 2 to 4 right parenthesis degree normal upper C',
    clearspeak: 'open paren 2 to 4 close paren times degrees Celsius',
  },
  {
    label: 'lists-22',
    latex: String.raw`\qtyrange[range-units = repeat]{2}{4}{\degreeCelsius}`,
    mathspeak: '2 degree normal upper C to 4 degree normal upper C',
    clearspeak: '2 degrees Celsius to 4 degrees Celsius',
  },
  {
    label: 'lists-23',
    latex: String.raw`\qtyrange[range-units = single]{2}{4}{\degreeCelsius}`,
    mathspeak: '2 to 4 degree normal upper C',
    clearspeak: '2 to 4 degrees Celsius',
  },
  {
    label: 'lists-24',
    latex: String.raw`\qtyproduct{2 x 4}{\metre}`,
    mathspeak: '2 meters times 4 meters',
    clearspeak: '2 meters times 4 meters',
  },
  {
    label: 'lists-25',
    latex: String.raw`\qtyproduct[product-units = bracket-power]{2 x 4}{\metre}`,
    mathspeak:
      'left parenthesis 2 times 4 right parenthesis meters squared',
    clearspeak: 'open paren 2 times 4 close paren times square meters',
  },
  {
    label: 'lists-26',
    latex: String.raw`\qtyproduct[product-units = power]{2 x 4}{\metre}`,
    mathspeak: '2 times 4 meters squared',
    clearspeak: '2 times 4 square meters',
  },
  {
    label: 'lists-27',
    latex: String.raw`\qtyproduct[product-units = bracket-power]{2 x 4 x 6}{\metre}`,
    mathspeak:
      'left parenthesis 2 times 4 times 6 right parenthesis meters cubed',
    clearspeak:
      'open paren 2 times 4 times 6 close paren times cubic meters',
  },
  {
    label: 'lists-28',
    latex: String.raw`\qtyproduct[product-units = bracket-power]{2 x 4}{\metre\squared}`,
    mathspeak:
      'left parenthesis 2 times 4 right parenthesis meters Superscript 4',
    clearspeak:
      'open paren 2 times 4 close paren times meters to the fourth power',
  },
  {
    label: 'lists-29',
    latex: String.raw`\sisetup{per-mode=power}`,
    mathspeak: '',
    clearspeak: '',
  },
  {
    label: 'lists-30',
    latex: String.raw`\qtyrange{-729}{659}{\per\cm}`,
    mathspeak:
      'negative 729 centimeters Superscript negative 1 Baseline to 659 centimeters Superscript negative 1',
    clearspeak:
      'negative 729 reciprocal centimeters to 659 reciprocal centimeters',
  },
  {
    label: 'lists-31',
    latex: String.raw`\qtyrange{-729}{659}{\watt\per\gram}`,
    mathspeak:
      'negative 729 watts grams Superscript negative 1 Baseline to 659 watts grams Superscript negative 1',
    clearspeak: 'negative 729 watts per gram to 659 watts per gram',
  },
  {
    label: 'lists-32',
    latex: String.raw`\qty{-729}{\watt\per\gram}`,
    mathspeak: 'negative 729 watts grams Superscript negative 1',
    clearspeak: 'negative 729 watts per gram',
  },
  {
    label: 'lists-33',
    latex: String.raw`\qtyrange{-729}{659}{\cm}`,
    mathspeak: 'negative 729 centimeters to 659 centimeters',
    clearspeak: 'negative 729 centimeters to 659 centimeters',
  },
  {
    label: 'lists-34',
    latex: String.raw`\qtyrange{200}{400}{\degreeCelsius}`,
    mathspeak: '200 degree normal upper C to 400 degree normal upper C',
    clearspeak: '200 degrees Celsius to 400 degrees Celsius',
  },
];

const declareSIUnitCases: TestCase[] = [
  {
    label: 'DeclareSIUnit-0',
    latex: String.raw`\DeclareSIUnit[inter-unit-product = \times]{\hello}{FakeUnit} \unit{\hello\kg\second}`,
    mathspeak: 'FakeUnit kilograms seconds',
    clearspeak: 'FakeUnit kilograms seconds',
  },
  {
    label: 'DeclareSIUnit-1',
    latex: String.raw`\unit{\kg\second}`,
    mathspeak: 'kilograms seconds',
    clearspeak: 'kilograms seconds',
  },
  {
    label: 'DeclareSIUnit-2',
    latex: String.raw`\unit{\hello\kg\second}`,
    mathspeak: 'FakeUnit kilograms seconds',
    clearspeak: 'FakeUnit kilograms seconds',
  },
  {
    label: 'DeclareSIUnit-3',
    latex: String.raw`\unit[inter-unit-product = \,]{\hello\kg\second}`,
    mathspeak: 'FakeUnit kilograms seconds',
    clearspeak: 'FakeUnit kilograms seconds',
  },
  {
    label: 'DeclareSIUnit-4',
    latex: String.raw`\DeclareSIUnit{\faren}{\degree F} \unit{\faren\kg\second}`,
    mathspeak: 'degree normal upper F kilograms seconds',
    clearspeak: 'degrees normal F kilograms seconds',
  },
  {
    label: 'DeclareSIUnit-5',
    latex: String.raw`\qty{1.2}{\faren}`,
    mathspeak: '1.2 degree normal upper F',
    clearspeak: '1.2 degrees normal F',
  },
];

export type TestSection = {
  title: string;
  cases: TestCase[];
};

export const testSections: TestSection[] = [
  { title: 'ang', cases: angCases },
  { title: 'num', cases: numCases },
  { title: 'complexnum', cases: complexnumCases },
  { title: 'complexqty', cases: complexqtyCases },
  { title: 'unit', cases: unitCases },
  { title: 'qty', cases: qtyCases },
  { title: 'lists', cases: listCases },
  { title: 'DeclareSIUnit', cases: declareSIUnitCases },
];
