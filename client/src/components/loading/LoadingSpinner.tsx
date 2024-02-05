function LoadingPulse() {
  return (
    <div className="flex items-center justify-center py-5">
      <div
        className="spinner-item bg-blue-800 animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="spinner-item bg-blue-600 animate-pulse"
        style={{ animationDelay: "0.4s" }}
      />
      <div
        className="spinner-item bg-blue-400 animate-pulse"
        style={{ animationDelay: "0.6s" }}
      />
      <div
        className="spinner-item bg-blue-200 animate-pulse"
        style={{ animationDelay: "0.8s" }}
      />
    </div>
  );
}

export default LoadingPulse;
