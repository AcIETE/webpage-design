const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const stats = document.querySelectorAll('#stats strong');
stats.forEach((stat, index) => {
  stat.animate(
    [
      { transform: 'translateY(0)', filter: 'brightness(1)' },
      { transform: 'translateY(-2px)', filter: 'brightness(1.2)' },
      { transform: 'translateY(0)', filter: 'brightness(1)' },
    ],
    {
      duration: 1800 + index * 120,
      iterations: Infinity,
      easing: 'ease-in-out',
    }
  );
});

const storagePrefix = 'team-profile:';

document.querySelectorAll('.member-card').forEach((card) => {
  const memberId = card.dataset.member;
  const storageKey = `${storagePrefix}${memberId}`;
  const avatarInput = card.querySelector('[data-avatar-input]');
  const descriptionInput = card.querySelector('[data-description-input]');
  const avatarImage = card.querySelector('[data-avatar-image]');
  const avatarFallback = card.querySelector('[data-avatar-fallback]');

  const updateAvatar = (source) => {
    if (source) {
      avatarImage.src = source;
      avatarImage.hidden = false;
      avatarFallback.hidden = true;
    } else {
      avatarImage.removeAttribute('src');
      avatarImage.hidden = true;
      avatarFallback.hidden = false;
    }
  };

  const saveState = () => {
    const state = {
      description: descriptionInput.value,
      avatar: avatarImage.hidden ? '' : avatarImage.src,
    };

    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  const storedState = localStorage.getItem(storageKey);
  if (storedState) {
    try {
      const parsedState = JSON.parse(storedState);
      if (typeof parsedState.description === 'string') {
        descriptionInput.value = parsedState.description;
      }
      if (typeof parsedState.avatar === 'string' && parsedState.avatar) {
        updateAvatar(parsedState.avatar);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  avatarInput.addEventListener('change', () => {
    const [file] = avatarInput.files;

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      updateAvatar(String(reader.result));
      saveState();
    });
    reader.readAsDataURL(file);
  });

  descriptionInput.addEventListener('input', saveState);
});