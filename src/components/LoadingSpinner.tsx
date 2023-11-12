const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full border-t-4 border-b-4 border-gray-800 h-12 w-12"></div>
    </div>
  );
};

export default LoadingSpinner;
