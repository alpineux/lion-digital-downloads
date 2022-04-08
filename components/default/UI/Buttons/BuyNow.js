import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { PageContext } from "@template/Pages/Context"

import { Modal, Group, Button, Text, LoadingOverlay, Space } from '@mantine/core';
import { LoginForm } from '@template'

import { createCheckoutSession } from '~/lib/purchase/stripe'

import { MdOutlinePayment } from 'react-icons/md'

const BuyNowButton = (props) => {

	//const { product, user } = props;
	const router = useRouter();

	const context = useContext(PageContext);
    const { user, product } = context;
    console.log('context in buy now', product)

	const [openCheckout, setOpenCheckout] = useState(false);
	const [openLogin, setOpenLogin] = useState(false)
	const [loading, setLoading] = useState(true);

	const [checkoutSession, setCheckoutSession] = useState()

	const open = async () => {
		setOpenCheckout(true)
		let session = await createCheckoutSession(product.id, user.id, product.stripe_id);
		setCheckoutSession(session)
		setLoading(false)
	}

	return(
		<React.Fragment>
	      <Modal
	        opened={openCheckout}
	        onClose={() => setOpenCheckout(false)}
	        title={
	        	<Text size="xl" weight={700}>
	        		{product.title} 
	        		<Text component="span" size="lg" color="green" weight={700}>${product.price}</Text>
	        	</Text>
	        }
	        centered
	      >
	      	<LoadingOverlay visible={loading} />

	      	{checkoutSession &&
	      		<>
			      	<Text mb="xl" size="md" weight={400}>Your download will be available instantly after purchase.</Text>
			        <Button
			        	component="a"
			        	href={checkoutSession.data.url}
			        	color="dark"
			        	fullWidth
			        	leftIcon={<MdOutlinePayment />}
			        >
			        	Secure purchase
			        </Button>
	        	</>
	    	}

	      </Modal>

	      <Modal
	        opened={openLogin}
	        onClose={() => setOpenLogin(false)}
	        title={<Text size="xl" weight={700}>Login to purchase</Text>}
	        centered
	      >
	      	<Space h="xs" />
	        <LoginForm redirect={router.asPath} />
	      </Modal>

	      <Group position="center">
	      	{user ? 
	        	<Button color="dark" onClick={() => open()} leftIcon={<MdOutlinePayment />}>Buy now</Button>
	        :
	        	<Button color="dark" onClick={() => setOpenLogin(true)} leftIcon={<MdOutlinePayment />}>Buy now</Button>
	    	}
	      </Group>
	    </React.Fragment>
	)
}

export default BuyNowButton;
