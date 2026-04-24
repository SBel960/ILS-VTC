/* ===== ILS VTC — Route 3D · Nuit permanente · Étoiles filantes =====
   Simplifié : pas de cycle jour/nuit, lune fixe, étoiles filantes
================================================================== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ──────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x04040e, 1);

  /* ── Scène ─────────────────────────────────────────────── */
  const scene  = new THREE.Scene();
  scene.fog    = new THREE.FogExp2(0x04040e, 0.026);

  /* ── Caméra ────────────────────────────────────────────── */
  const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 350);
  camera.position.set(0, 1.8, 3);
  camera.lookAt(0, 2.4, -80);

  /* ── Route ─────────────────────────────────────────────── */
  const mRoad = new THREE.MeshPhongMaterial({ color: 0x0c0c18, shininess: 60, specular: new THREE.Color(0x14142a) });
  const gRoad = new THREE.PlaneGeometry(8, 400); gRoad.rotateX(-Math.PI / 2);
  const road  = new THREE.Mesh(gRoad, mRoad);
  road.position.set(0, 0, -198);
  scene.add(road);

  /* ── Herbe ─────────────────────────────────────────────── */
  const gGrass = new THREE.PlaneGeometry(600, 400); gGrass.rotateX(-Math.PI / 2);
  const grass  = new THREE.Mesh(gGrass, new THREE.MeshPhongMaterial({ color: 0x090e06 }));
  grass.position.set(0, -0.01, -198);
  scene.add(grass);

  /* ── Bords de route ────────────────────────────────────── */
  [-4.0, 4.0].forEach(x => {
    const pts = [new THREE.Vector3(x, 0.015, 3), new THREE.Vector3(x, 0.015, -380)];
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    ));
  });

  /* ── Tirets centraux ───────────────────────────────────── */
  const D_LEN = 3.2, D_GAP = 7.5, D_STEP = D_LEN + D_GAP, D_N = 36;
  const D_ZONE = D_N * D_STEP;
  const mDash  = new THREE.MeshBasicMaterial({ color: 0xd4b03a, transparent: true, opacity: 0.8 });
  const dashes = [];
  for (let i = 0; i < D_N; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, D_LEN), mDash);
    m.position.set(0, 0.015, -i * D_STEP);
    scene.add(m); dashes.push(m);
  }

  /* ── Arbres ────────────────────────────────────────────── */
  const gTrunk = new THREE.CylinderGeometry(0.08, 0.14, 1.0, 5);
  const gCone1 = new THREE.ConeGeometry(0.55, 1.4, 5);
  const gCone2 = new THREE.ConeGeometry(0.32, 0.9, 5);
  const mTrunk = new THREE.MeshPhongMaterial({ color: 0x2a1206 });
  const mLeaf  = new THREE.MeshPhongMaterial({ color: 0x122a0c });
  const T_GAP  = 24, T_N = 8, T_ZONE = T_N * T_GAP;
  const trees  = [];
  for (let i = 0; i < T_N; i++) {
    [-11 - Math.random() * 3, 11 + Math.random() * 3].forEach(x => {
      const g = new THREE.Group();
      const tr = new THREE.Mesh(gTrunk, mTrunk); tr.position.y = 0.5; g.add(tr);
      const c1 = new THREE.Mesh(gCone1, mLeaf);  c1.position.y = 1.55; g.add(c1);
      const c2 = new THREE.Mesh(gCone2, mLeaf);  c2.position.y = 2.4;  g.add(c2);
      const s = 0.85 + Math.random() * 0.35;
      g.scale.set(s, s, s);
      g.position.set(x, 0, -i * T_GAP);
      scene.add(g); trees.push(g);
    });
  }

  /* ── Étoiles (fixes, toujours visibles) ────────────────── */
  const S_N = 650, sp = new Float32Array(S_N * 3);
  for (let i = 0; i < S_N; i++) {
    sp[i*3]   = (Math.random() - 0.5) * 450;
    sp[i*3+1] = Math.random() * 100 + 12;
    sp[i*3+2] = -Math.random() * 320 - 10;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.68, fog: false })
  ));

  /* ── Lune (position fixe, haut-gauche) ─────────────────── */
  const mMoon    = new THREE.MeshBasicMaterial({ color: 0xe8f0ff, fog: false });
  const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), mMoon);
  moonMesh.position.set(-115, 38, -150);  // haut-gauche
  scene.add(moonMesh);
  // Halo discret autour de la lune
  const mMoonGlow = new THREE.MeshBasicMaterial({ color: 0xd0e8ff, transparent: true, opacity: 0.06, fog: false });
  const moonGlow  = new THREE.Mesh(new THREE.SphereGeometry(3.5, 12, 12), mMoonGlow);
  moonGlow.position.set(-115, 38, -150);
  scene.add(moonGlow);
  // Lumière lunaire douce
  const moonLight = new THREE.DirectionalLight(0x4466aa, 0.35);
  moonLight.position.set(-115, 38, -150);
  scene.add(moonLight);

  /* ── Lumières ───────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0x060614, 3.5));

  /* ── Phares (nos propres phares, éclairent devant) ──────── */
  const ownLT = new THREE.Object3D(); ownLT.position.set(-2.5, 0, -90);
  const ownRT = new THREE.Object3D(); ownRT.position.set( 2.5, 0, -90);
  scene.add(ownLT, ownRT);

  const headL = new THREE.SpotLight(0xe8f2ff, 5.0, 180, Math.PI / 7.5, 0.65, 1.5);
  const headR = new THREE.SpotLight(0xe8f2ff, 5.0, 180, Math.PI / 7.5, 0.65, 1.5);
  headL.position.set(-0.85, 1.5, 1);
  headR.position.set( 0.85, 1.5, 1);
  headL.target = ownLT;
  headR.target = ownRT;
  scene.add(headL, headR);

  /* ════════════════════════════════════════════════════════
     ÉTOILES FILANTES
  ════════════════════════════════════════════════════════ */
  const shootingStars = [];
  let nextShoot = 2 + Math.random() * 3;  // première étoile dans 2-5s

  function spawnShootingStar() {
    // Départ : coin haut du ciel
    const sx = (Math.random() - 0.3) * 180;
    const sy = Math.random() * 35 + 25;
    const sz = -Math.random() * 120 - 60;
    // Direction : diagonale vers le bas
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    const speed = 3.5 + Math.random() * 3;
    const dx    = Math.cos(angle) * speed;
    const dy    = -Math.sin(angle) * speed * 0.6;
    const trailLen = 6 + Math.random() * 8;

    const pts  = [
      new THREE.Vector3(sx, sy, sz),
      new THREE.Vector3(sx - dx * trailLen * 0.06, sy - dy * trailLen * 0.06, sz)
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 1.0, fog: false
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);

    return { line, geo, mat, x: sx, y: sy, z: sz, dx, dy, trailLen, life: 1.0 };
  }

  /* ════════════════════════════════════════════════════════
     BOUCLE D'ANIMATION
  ════════════════════════════════════════════════════════ */
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.013;

    /* ─ Tirets ─ */
    for (let i = 0; i < dashes.length; i++) {
      dashes[i].position.z += 0.16;
      if (dashes[i].position.z > 4) dashes[i].position.z -= D_ZONE;
    }

    /* ─ Arbres ─ */
    for (let i = 0; i < trees.length; i++) {
      trees[i].position.z += 0.16;
      if (trees[i].position.z > 8) trees[i].position.z -= T_ZONE;
    }

    /* ─ Étoiles filantes ─ */
    nextShoot -= 0.013;
    if (nextShoot <= 0) {
      shootingStars.push(spawnShootingStar());
      nextShoot = 3.5 + Math.random() * 6;  // prochaine dans 3.5-9.5s
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.life -= 0.022;
      s.x += s.dx * 0.4;
      s.y += s.dy * 0.4;

      const pa = s.geo.attributes.position.array;
      pa[0] = s.x;  pa[1] = s.y;  pa[2] = s.z;
      pa[3] = s.x - s.dx * s.trailLen * 0.12;
      pa[4] = s.y - s.dy * s.trailLen * 0.12;
      pa[5] = s.z;
      s.geo.attributes.position.needsUpdate = true;
      s.mat.opacity = Math.max(0, s.life);

      if (s.life <= 0) {
        scene.remove(s.line);
        s.geo.dispose();
        s.mat.dispose();
        shootingStars.splice(i, 1);
      }
    }

    /* ─ Caméra (oscillation très douce) ─ */
    const targetX = Math.sin(t * 0.09) * 0.06 + Math.sin(t * 0.17) * 0.02;
    const targetY = 1.8 + Math.sin(t * 0.13) * 0.025;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ─────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
