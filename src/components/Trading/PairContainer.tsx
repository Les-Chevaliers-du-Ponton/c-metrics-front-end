import { Grid } from '@mui/material'
import { tradingDataDef } from '../DataManagement'
import { TradingChart } from './Chart'
import { PublicTradeHistory } from './PublicTradeHistory'

export function PairContainer(data: { tradingData: tradingDataDef }) {
  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Grid xs={10}>
        <TradingChart tradingData={data.tradingData} />
      </Grid>
      <Grid xs={2}>
        <PublicTradeHistory tradingData={data.tradingData} />
      </Grid>
    </Grid>
  )
}
