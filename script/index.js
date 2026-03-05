const createElements = (arr) => {
    const htmlElement = arr.map((el) => `<span class='btn bg-info/10 border-none hover:bg-info'>${el}</span>`);
    return (htmlElement.join(' '))
}
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}
const manageSpanner = (status) => {
    if (status == true) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else {
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

const loadLevel = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLevel(json.data))
}
const removeActive = () => {
    const buttons = document.querySelectorAll('.lesson-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active')
    });
}
const loadWord = (id) => {
    manageSpanner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then(json => {
            removeActive();
            const clickedBtn = document.getElementById(`lesson-btn-${id}`)
            clickedBtn.classList.add('active')
            displayWord(json.data)

        })
}
const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}
const displayWordDetails = (word) => {
    const detailsBox = document.getElementById('details-container');
    console.log(word)
    detailsBox.innerHTML = `
        <div class="space-y-6 p-5">
            <h2 class="font-bold text-4xl">${word.word} (<i class="fa-solid fa-microphone-lines"></i>   :${word.meaning})</h2>
            <div class="space-y-3">
                <p class="font-bold text-2xl">Meaning</p>
                <p class="font-medium text-2xl">${word.meaning}</p>
            </div>
            <div class="space-y-3">
                <p class="font-bold text-2xl">Example</p>
                <p class="font-medium ">${word.sentence}</p>
            </div>
            <div class="space-y-3">
                <p class="font-bold text-2xl">সমার্থক শব্দ গুলো</p>
                <div class="space-x-5">
                    ${createElements(word.synonyms)}
                </div>
            </div>
        </div>
        `
    document.getElementById('my_modal_5').showModal();
}
const displayWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';
    if (words.length == 0) {
        wordContainer.innerHTML = `
         <div class="col-span-full text-center py-15 bangla-font space-y-5">
             <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <p class="text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>

        </div>
         `;
        manageSpanner(false)
        return;
    }
    words.forEach(word => {

        const newWord = document.createElement('div');
        newWord.innerHTML = `
        <div class="text-center bg-base-100 rounded-xl px-5 py-10 space-y-5 shadow">
            <h2 class="font-bold text-3xl">${word.word ? word.word : "কোন শব্দ পাওয়া যায়নি"}</h2>
            <p class="text-xl font-semibold">Meaning /Pronunciation</p>
            <div class="font-bold text-2xl text-black/70 bangla-font">"${word.meaning ? word.meaning : "কোন অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "কোন pronunciation পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick ="loadWordDetail(${word.id})" class="btn bg-info/10 border-none hover:bg-info"><i
                        class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-info/10 border-none hover:bg-info"><i
                        class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.append(newWord)
        manageSpanner(false);
    });
}
const displayLevel = (data) => {
    const levelContainer = document.getElementById('level-container');
    data.forEach(level => {
        const newLesson = document.createElement('span');
        newLesson.innerHTML = `
        <button id="lesson-btn-${level.level_no}" onclick="loadWord(${level.level_no})" 
        class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson -${level.level_no}
        </button>
        `
        levelContainer.appendChild(newLesson)

    });
}
loadLevel();
document.getElementById("btn-search").addEventListener('click', () => {
    removeActive();
    const searchValue = document.getElementById('input-search').value;
    fetch('https://openapi.programming-hero.com/api/words/all')
        .then(res => res.json())
        .then(json => {
            const allWord = json.data;
            const filterWord = allWord.filter(word => word.word.toLowerCase().includes(searchValue));
            displayWord(filterWord)
        }
        )

})