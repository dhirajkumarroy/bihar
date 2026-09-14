export const historyEras=[
 {id:'early',labelHindi:'प्रारंभिक',fullLabelHindi:'प्रारंभिक बिहार',labelEnglish:'Early Bihar'},
 {id:'ancient',labelHindi:'प्राचीन',fullLabelHindi:'प्राचीन काल',labelEnglish:'Ancient'},
 {id:'medieval',labelHindi:'मध्यकाल',fullLabelHindi:'मध्यकाल',labelEnglish:'Medieval'},
 {id:'colonial',labelHindi:'औपनिवेशिक',fullLabelHindi:'औपनिवेशिक काल',labelEnglish:'Colonial'},
 {id:'freedom',labelHindi:'स्वतंत्रता आंदोलन',fullLabelHindi:'स्वतंत्रता आंदोलन',labelEnglish:'Freedom Movement'},
 {id:'modern',labelHindi:'आधुनिक',fullLabelHindi:'आधुनिक बिहार',labelEnglish:'Modern Bihar'}
];
export const eraById=id=>historyEras.find(x=>x.id===id);
