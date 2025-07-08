document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const mapContainer = document.getElementById('map-container');

  const monsters = [
    { name: 'malalfa', img: 'malalfa.png' },
    { name: 'malarvore', img: 'malarvore.png' },
    { name: 'malpik', img: 'malpik.png' },
    { name: 'malzerb', img: 'malzerb.png' },
    { name: 'Voce', img: 'Sacreir.png' }
  ];

  let selectedMob = null;

  // Render monsters in sidebar
  sidebar.insertAdjacentHTML('afterbegin', monsters.map(m => `
    <div class="opcao" data-img="${m.img}" title="${m.name}">
      <img src="img/${m.img}" alt="${m.name}">
      <span>${m.name}</span>
    </div>
  `).join(''));

  sidebar.querySelectorAll('.opcao').forEach(opcao => {
    opcao.addEventListener('click', () => {
      sidebar.querySelectorAll('.opcao').forEach(el => el.classList.remove('selecionada'));
      opcao.classList.add('selecionada');
      selectedMob = opcao.getAttribute('data-img');
    });
  });

  // Posições vazias
  const emptySquares = new Set([
    '0,0','0,1','0,2','0,3','0,4','0,5','0,6','0,10','0,11','0,12','0,18','0,19',
    '1,0','1,1','1,2','1,3','1,4','1,11','1,12','1,15','1,19',
    '2,0','2,1','2,2','2,3','2,11','2,12',
    '3,0','3,1','3,2','3,6','3,11',
    '4,0','4,1','4,6','4,11',
    '5,0','5,1','5,10','5,11','5,16',
    '6,0','6,1','6,7','6,8','6,9','6,10','6,11','6,12','6,19',
    '7,0','7,1','7,2','7,7','7,12','7,13','7,17','7,18','7,19',
    '8,0','8,1','8,2','8,3','8,4','8,5','8,6','8,7','8,13','8,14','8,15','8,16','8,17','8,18','8,19',
    '9,0','9,1','9,2','9,3','9,4','9,5','9,6','9,7','9,13','9,14','9,15','9,16','9,17','9,18','9,19',
    '10,0','10,1','10,2','10,6','10,7','10,13','10,16','10,17','10,18','10,19',
    '11,0','11,1','11,6','11,7','11,9','11,13','11,17','11,18','11,19',
    '12,0','12,7','12,8','12,9','12,10','12,11','12,12','12,13','12,18','12,19',
    '13,0','13,3','13,9','13,10','13,11','13,15','13,18','13,19',
    '14,0','14,9','14,10','14,18','14,19',
    '15,0','15,1','15,9','15,18','15,19',
    '16,0','16,1','16,7','16,9','16,17','16,18','16,19',
    '17,0','17,1','17,2','17,8','17,9','17,13','17,16','17,17','17,18','17,19',
    '18,0','18,1','18,2','18,3','18,4','18,7','18,8','18,9','18,15','18,16','18,17','18,18','18,19',
    '19,0','19,1','19,2','19,3','19,4','19,5','19,6','19,7','19,8','19,9','19,10','19,11','19,14','19,15','19,16','19,17','19,18','19,19'
  ]);

  // Posições com blocos mais altos
  let valor = 1.4;
  const heightSquares = new Map([
    ['1,7',valor],
    ['2,16',valor],
    ['3,4',valor],['3,13',valor],
    ['4,8',valor],['4,18',valor],
    ['6,5',valor],['6,15',valor],
    ['7,9',valor],
    ['8,11',valor],
    ['10,10',valor],
    ['11,5',valor],['11,12',valor],['11,15',valor],
    ['14,7',valor],['14,17',valor],
    ['15,3',valor],['15,12',valor],['15,15',valor],
    ['16,6',valor],
  ]);

  for(let row = 0; row < 20; row++) {
    for(let col = 0; col < 20; col++) {
      const pos = `${row},${col}`;
      const cube = document.createElement('div');
      cube.classList.add('cube');

      if (emptySquares.has(pos)) {
        cube.style.opacity = '0';
        cube.style.pointerEvents = 'none';
      }

      // Aumenta altura se a posição estiver no tallSquares
      if (heightSquares.has(pos)) {
          const scale = heightSquares.get(pos);
          cube.style.transform = `scaleZ(${scale}) translateZ(6px)`;
          cube.style.transformOrigin = 'bottom';
		  cube.style.pointerEvents = 'none';
      }

      ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(faceName => {
        const face = document.createElement('div');
        face.classList.add('face', faceName);
        cube.appendChild(face);
      });

      cube.addEventListener('click', () => {
        if (!selectedMob) {
          alert('Selecione um monstro na sidebar primeiro!');
          return;
        }
        const frontFace = cube.querySelector('.front');
        frontFace.style.backgroundImage = '';

        let img = frontFace.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          frontFace.appendChild(img);

          img.style.position = 'absolute';
          img.style.top = '50%';
          img.style.left = '50%';
          img.style.transform = 'translate(-50%, -50%) rotate(50deg)';
          img.style.width = '120%';
          img.style.height = '120%';
          img.style.pointerEvents = 'none';
          img.style.userSelect = 'none';
          img.style.objectFit = 'contain';
        }

        img.src = `img/${selectedMob}`;
      });

      cube.addEventListener('contextmenu', e => {
        e.preventDefault();
        const frontFace = cube.querySelector('.front');
        frontFace.style.backgroundImage = '';
        const img = frontFace.querySelector('img');
        if (img) {
          img.remove();
        }
      });

      mapContainer.appendChild(cube);
    }
  }

  // Deselecionar monstro ao clicar fora da sidebar
  document.body.addEventListener('click', e => {
    if (!e.target.closest('#sidebar')) {
      sidebar.querySelectorAll('.opcao').forEach(el => el.classList.remove('selecionada'));
      selectedMob = null;
    }
  });

  // CONTROLES
  const zoomRange = document.getElementById('zoomRange');
  const rotateXRange = document.getElementById('rotateXRange');
  const rotateZRange = document.getElementById('rotateZRange');
  const zoomVal = document.getElementById('zoomVal');
  const rotateXVal = document.getElementById('rotateXVal');
  const rotateZVal = document.getElementById('rotateZVal');

  function updateTransform() {
    const zoom = parseFloat(zoomRange.value);
    const rotX = parseFloat(rotateXRange.value);
    const rotZ = parseFloat(rotateZRange.value);

    zoomVal.textContent = zoom.toFixed(2);
    rotateXVal.textContent = rotX;
    rotateZVal.textContent = rotZ;

    mapContainer.style.transform = `
      scale(${zoom}) 
      rotateX(${rotX}deg) 
      rotateZ(${rotZ}deg) 
      translateZ(0)
    `;
  }

  updateTransform();

  zoomRange.addEventListener('input', updateTransform);
  rotateXRange.addEventListener('input', updateTransform);
  rotateZRange.addEventListener('input', updateTransform);
});
