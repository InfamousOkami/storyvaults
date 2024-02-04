function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center my-5">
      <div className="spinner-item bg-blue-800 animate-pulse" />
      <div className="spinner-item bg-blue-600 animate-spin" />
      <div className="spinner-item bg-blue-400 animate-spin" />
      <div className="spinner-item bg-blue-200 animate-spin" />
    </div>
  );
}

export default LoadingSpinner;
