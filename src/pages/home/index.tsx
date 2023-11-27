import React, { createRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Canvas from './Canvas';

const kuanShiList = [
  { label: '圆领', key: 'yuanling' },
  { label: '连帽', key: 'lianmao' },
  { label: '短袖', key: 'duanxiu' },
];

const weizhiList = [
  { label: '左', key: 'left', left: 150, top: 140 },
  { label: '中', key: 'center', left: 235, top: 140 },
  { label: '右', key: 'right', left: 320, top: 140 },
];

const Home: React.FunctionComponent = () => {
  const [kuanShi, setKuanShi] = React.useState('yuanling');
  const [color, setColor] = React.useState(0);
  const [zuoXiong, setZuoxiong] = React.useState();
  const canvasRef = createRef<any>();

  const handleClickKuanShi = (key: string) => {
    setKuanShi(key);
    const src = `/images/${key}/${color + 1}.png`;
    canvasRef.current.setBg(src);
  };

  const handleClickColor = (index: number) => {
    setColor(index);
    const src = `/images/${kuanShi}/${index + 1}.png`;
    canvasRef.current.setBg(src);
  };

  const addImg = async (src: string | ArrayBuffer | null) => {
    const img = await canvasRef.current.addImg(src);
    setZuoxiong(img);
  };

  return (
    <Container>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={4}>
          <Grid item md={4}>
            <Stack spacing={4}>
              <Stack spacing={1.5}>
                <Typography variant="h4">衣服款式</Typography>
                <Stack direction="row" spacing={1}>
                  {kuanShiList.map((item, index) => {
                    return (
                      <Button
                        variant={
                          item.key === kuanShi ? 'contained' : 'outlined'
                        }
                        key={item.key}
                        onClick={() => handleClickKuanShi(item.key)}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </Stack>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="h4">衣服色号</Typography>
                <Grid container>
                  {new Array(22).fill(0).map((_, index) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Grid item key={index}>
                        <ButtonBase onClick={() => handleClickColor(index)}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              width: 48,
                              p: 0.5,
                              backgroundColor: (theme) =>
                                color === index
                                  ? theme.palette.primary.main
                                  : '',
                              // border: '1px transparent solid',
                              // borderColor: (theme) =>
                              //   color === index
                              //     ? theme.palette.primary.main
                              //     : '',
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                border: '1px #333 solid',
                                mb: 0.5,
                                backgroundImage: `url(/images/${kuanShi}/${
                                  index + 1
                                }.png)`,
                                backgroundSize: 'cover',
                              }}
                            />
                            <Typography variant="caption">
                              {index + 1}
                            </Typography>
                          </Box>
                        </ButtonBase>
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="h4">胸口位置</Typography>

                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    width: 'auto',
                  }}
                >
                  <Button size="small" variant="outlined">
                    上传图章
                  </Button>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target?.files && e.target?.files.length > 0) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                          const src = reader.result;
                          addImg(src);
                        };
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'red',
                      zIndex: 1,
                      left: 0,
                      right: 0,
                      opacity: 0,
                    }}
                  />
                </Box>
                <Stack direction="row" spacing={1}>
                  {zuoXiong &&
                    weizhiList.map((item, index) => {
                      return (
                        <Button
                          size="small"
                          key={item.key}
                          onClick={() => {
                            zuoXiong.set({
                              left: item.left,
                              top: item.top,
                              selectable: true,
                            });
                            canvasRef.current.canvas.renderAll();
                          }}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={8}>
            <Canvas ref={canvasRef} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
