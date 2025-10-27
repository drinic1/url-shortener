import { useNavigate } from "react-router";

export const useViewTransitionNavigate = () => {
  const navigate = useNavigate();

  return (to: string) => {
    if (!document.startViewTransition) {
      navigate(to);
      return;
    }

    document.startViewTransition(() => navigate(to));
  };
};
