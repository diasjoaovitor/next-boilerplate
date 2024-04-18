export const metadata = {
  title: 'Next Boilerplate',
  description: 'Como criar um boilerplate para projetos com Next.js'
}

const RootLayout = ({ children }) => {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
