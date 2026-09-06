// Emil Kowalski Motion Curves & Presets

export const EASINGS = {
  materialEntrance: [0.16, 1, 0.3, 1],
  subtleOvershoot: [0.34, 1.56, 0.64, 1],
  gentleDeceleration: [0.25, 1, 0.5, 1],
};

export const VIEWPORT_CONFIG = {
  once: true,
  margin: "-10% 0px",
};

export const INTERACTIVE_MOTION = {
  whileHover: { scale: 1.03, transition: { ease: EASINGS.subtleOvershoot, duration: 0.25 } },
  whileTap: { scale: 0.97, transition: { ease: EASINGS.gentleDeceleration, duration: 0.15 } },
};

export const CONTAINER_STAGGER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const ITEM_FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASINGS.materialEntrance,
    },
  },
};

export const MODAL_BACKDROP = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: EASINGS.gentleDeceleration } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASINGS.gentleDeceleration } },
};

export const MODAL_CARD = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASINGS.materialEntrance,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 12,
    transition: {
      duration: 0.2,
      ease: EASINGS.gentleDeceleration,
    },
  },
};
