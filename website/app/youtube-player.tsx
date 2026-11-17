type YouTubePlayerProps = {
  id: string;
  title: string;
  playLabel: string;
  active: boolean;
  onPlay: () => void;
  featured?: boolean;
};

export default function YouTubePlayer({ id, title, playLabel, active, onPlay, featured = false }: YouTubePlayerProps) {
  return (
    <div className="youtube-player">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          ref={player => { player?.focus(); }}
        />
      ) : (
        <button type="button" onClick={onPlay} aria-label={playLabel}>
          <img
            src={`https://i.ytimg.com/vi/${id}/${featured ? "maxresdefault" : "mqdefault"}.jpg`}
            alt=""
            width={featured ? 1280 : 320}
            height={featured ? 720 : 180}
            loading="lazy"
          />
          <span className="play-icon" aria-hidden="true">▶</span>
        </button>
      )}
    </div>
  );
}
