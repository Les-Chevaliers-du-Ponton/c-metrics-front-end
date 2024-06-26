import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { tradingDataDef } from '../components/DataManagement'

export function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="/">
        Crypto Station
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export function getPairLogo(data: tradingDataDef, pair: string) {
  let logo = ''
  data.coinMarketCapMapping.forEach((pairData: any) => {
    if (
      pairData.symbol === pair.slice(0, pair.indexOf('-')) ||
      pairData.symbol === pair.slice(0, pair.indexOf('/'))
    ) {
      logo = `https://s2.coinmarketcap.com/static/img/coins/64x64/${pairData.id}.png`
    }
  })
  return logo
}
