// Load clips dynamically
async function loadClips(){
    const response = await fetch('/clips');
    const clips = await response.json();
    const container = document.getElementById('clips-container');
    container.innerHTML = '';
    clips.forEach(clip => {
        const card = document.createElement('div');
        card.className = 'clip-card';
        card.innerHTML = `
            <img src="${clip.thumbnail}" alt="${clip.title}">
            <h3>${clip.title}</h3>
            <button class="preview-btn" onclick="previewClip('${clip.clip}')">Preview</button>
            <a href="${clip.clip}" download class="download-btn">Download</a>
        `;
        container.appendChild(card);
    });
}
loadClips();

// Video Preview
function previewClip(src){
    const modal = document.getElementById('preview-modal');
    const video = document.getElementById('preview-video');
    video.src = src;
    modal.style.display = 'block';
}
function closePreview(){
    const modal = document.getElementById('preview-modal');
    const video = document.getElementById('preview-video');
    video.pause();
    modal.style.display = 'none';
}

// Search Filter
document.getElementById('search').addEventListener('input', function(){
    const searchValue = this.value.toLowerCase();
    document.querySelectorAll('.clip-card').forEach(card=>{
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(searchValue) ? 'block':'none';
    });
});