import { useState } from 'react'


export default function Theme({ children, theme }) {
  const [theme_, setTheme] = useState(theme)

  return (
    <>
      {
        children
      }
      <style jsx>{`
        {/* Text color */}
        
        :global(.text-dark-1) {
          color: ${theme.palette.text.primary.light};
        }
        :global(.text-dark-2) {
          color: ${theme.palette.text.primary.light};
        }
        :global(.text-primary-1) {
          color: ${theme.palette.primary.light};
        }
        :global(.text-primary-2) {
          color: ${theme.palette.primary.main};
        }
        :global(.text-primary-3) {
          color: ${theme.palette.primary.dark};
        }
        :global(.text-secondary-1) {
          color: ${theme.palette.secondary.light};
        }
        :global(.text-secondary-2) {
          color: ${theme.palette.secondary.main};
        }
        :global(.text-secondary-3) {
          color: ${theme.palette.secondary.dark};
        }
        :global(.text-error) {
          color: ${theme.palette.error.main};
        }

        {/* Background */}
        :global(.background-1) {
          background-color: ${theme.palette.background.paper};
        }
        :global(.background-2) {
          background-color: ${theme.palette.background.default};
        }
        :global(.background-primary-1) {
          background-color: ${theme.palette.primary.light};
        }
        :global(.background-primary-2) {
          background-color: ${theme.palette.primary.main};
        }
        :global(.background-primary-3) {
          background-color: ${theme.palette.primary.dark};
        }
        :global(.background-secondary-1) {
          background-color: ${theme.palette.secondary.light};
        }
        :global(.background-secondary-2) {
          background-color: ${theme.palette.secondary.main};
        }
        :global(.background-secondary-3) {
          background-color: ${theme.palette.secondary.dark};
        }
        :global(.background-error) {
          background-color: ${theme.palette.error.main};
        }
      `}</style>
      </>
  );
}

 {/* :global(::selection) {
          color: ${theme.colors.background3};
          background: ${theme.colors.third};
        }
        :global(::-webkit-scrollbar) {
          width: 12px;
          background-color: ${theme.colors.third};
        }
        :global(::-webkit-scrollbar-thumb) {
          border-radius: 3px;
          background-color: tomato;
        } */}