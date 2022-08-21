import { default as Trie, reverseString } from './Trie.mjs'
import { cpSync, readFileSync } from 'fs'



export default class WordSegmentation {
    constructor(word) {
        this.trieFW = new Trie();
        this.trieBW = new Trie();
        this.startIndex = 0;
        this.result_all = [];

        const contents = readFileSync('sea.txt', 'utf-8').split(/\n/);

        for (let word of contents) {
            this.trieFW.insert(word);
            this.trieBW.insert(reverseString(word));
        }

        this.isNumber = function (ch) {
            const number = "0123456789០១២៣៤៥៦៧៨៩";
            return number.includes(ch);
        }

        this.parseNumber = function (index, text) {
            let result = "";
            while (index < text.length) {
                let ch = text[index]
                ch = ch;
                if (this.isNumber(ch)) {
                    result += text[index]
                    index += 1
                } else {
                    return result;
                }
            }
            return result
        }

        this.isEnglish = function (ch) {
            const english = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return english.includes(ch);
        }

        this.parseEnglish = function (index, text) {
            let result = "";
            while (index < text.length) {
                let ch = text[index];
                ch = ch;
                if (this.isEnglish(ch) || this.isNumber(ch)) {
                    result += ch
                    index += 1
                } else {
                    return result;
                }
            }
            return result
        }


        this.parseTrie = function (index, text, model) {
            let word = '', foundWord = '';

            while (index < text.length) {
                let ch = text[index];
                word += ch;

                if (model.searchWord(word).length > 0) {
                    if (model.searchWordPrefix(word)) {
                        foundWord = word;
                    }
                } else if (model.searchWordPrefix(word)) {
                    return word;
                } else {
                    return foundWord;
                }

                index += 1;
            }

            return foundWord;
        }

        this.FW = function () {
            let result = [];
            let error = 0;
            let errorWord = '';
            this.startIndex = 0;
            let text = word;

            while (this.startIndex < text.length) {
                let ch = word[this.startIndex];
                ch = ch;
                let wording = '';

                if (this.isNumber(ch)) {
                    wording = this.parseNumber(this.startIndex, text);
                } else if (this.isEnglish(ch)) {
                    wording = this.parseEnglish(this.startIndex, text);
                } else {
                    wording = this.parseTrie(this.startIndex, text, this.trieFW);

                }

                let length = wording.length;

                if (length == 0) {
                    error += 1;
                    errorWord += ch;
                    this.startIndex += 1
                    continue
                }

                if (errorWord.length > 0) {
                    result.push(errorWord);
                    errorWord = '';
                }

                let rw = { "text": wording }
                result.push(rw);
                this.startIndex += length;
            }

            if (errorWord.length > 0) {
                result.push(errorWord);
            }

            return [error, result];
        }

        this.BW = function () {
            let result = [];
            let error = 0;
            let errorWord = '';
            this.startIndex = 0;
            let text = reverseString(word.toString());

            while (this.startIndex < text.length) {
                let ch = word[this.startIndex];
                ch = ch;
                let wording = '';

                if (this.isNumber(ch)) {
                    wording = this.parseNumber(this.startIndex, text);
                } else if (this.isEnglish(ch)) {
                    wording = this.parseEnglish(this.startIndex, text);
                } else {
                    wording = this.parseTrie(this.startIndex, text, this.trieFW);
                }

                let length = wording.length;
                if (length === 0) {
                    error += 1;
                    errorWord += ch;
                    this.startIndex += 1
                    continue
                }

                if (errorWord.length > 0) {
                    result.push(reverseString(errorWord.toString()));
                    errorWord = '';
                }

                let rw = { "text": reverseString(wording.toString()) }
                result.push(rw);
                this.startIndex += length;

                if (errorWord.length > 0) {
                    result.push(reverseString(errorWord.toString()));
                    errorWord = '';
                }
            }

            return [error, reverseString(result.toString())];
        }

        this.check_words = function () {
            let fw_error_count = this.FW()[0], resultFW = this.FW()[1];
            let bw_error_count = this.FW()[0], resultBW = this.BW()[1];
            console.log(`Use FW error: ${fw_error_count}`);
            console.log(`Use BW error: ${bw_error_count}`);
            if (fw_error_count <= bw_error_count) {
                console.log('Use FW');
                this.result_all.push(resultFW);
            } else {
                console.log('Use BW');
                this.result_all.push(resultBW);
            }
        }

        this.show = function () {
            console.log(`Text: ${word}`);
            console.log(this.result_all);
        }
    }
}