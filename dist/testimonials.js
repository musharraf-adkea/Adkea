// Likes are a visitor's own saved preference, not an aggregate review count.
const reviewLikeKey='adkea-review-likes-v1';
let likedReviews=new Set();
try{const stored=JSON.parse(localStorage.getItem(reviewLikeKey)||'[]');if(Array.isArray(stored))likedReviews=new Set(stored.filter(id=>typeof id==='string'));}catch{}
document.querySelectorAll('.review-like').forEach(button=>{
 const id=button.closest('[data-review-id]').dataset.reviewId;
 const label=button.getAttribute('aria-label');
 function update(){const liked=likedReviews.has(id);button.setAttribute('aria-pressed',String(liked));button.querySelector('span').textContent=liked?'Liked':'Like';button.setAttribute('aria-label',liked?label.replace(/^Like /,'Unlike '):label);}
 update();button.addEventListener('click',()=>{likedReviews.has(id)?likedReviews.delete(id):likedReviews.add(id);update();try{localStorage.setItem(reviewLikeKey,JSON.stringify([...likedReviews]));}catch{}});
});
