import WordSegmentation from './word_segmentation.mjs' 

// let kh_text = "មនុស្សម្នាក់"
let kh_text = "កើឡើរាល់ថ្ងែ"
// let kh_text = "សហភាពអឺរ៉ុបបានផ្ដល់ពេ៣ខ"

let word_segment = new WordSegmentation(kh_text);
word_segment.check_words();
word_segment.show();
